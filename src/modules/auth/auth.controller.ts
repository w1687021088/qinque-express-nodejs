// src/modules/auth/auth.controller.ts
import { Controller } from '@/utils/response.js';
import { AuthService } from './auth.service.js';
import { Request, Response } from 'express';
import { validateMiddleware } from '@/middlewares/validate.js';
import { AuthLoginBody, AuthRefreshBody, AuthRegisterBody, authSchemas } from '@/modules/auth/auth.schema.js';
import { APP_ENUMS } from '@/enums/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { generateSnowflake } from '@/utils/snowflake.js';
import { jwtConfig } from '@/config/jwtConfig.js';
import redisClient from '@/utils/redis.js';
import { appEnvConfig } from '@/env/index.js';
import { HttpCodeEnum } from '@/enums/code/http-code.js';
import { BusinessError } from '@/utils/error.js';

// 手机号+验证码，邮箱+密码，用户名+密码

export class AuthController extends Controller {
  // 服务实例
  private readonly _service = new AuthService();
  // 校验手机号是否已存在
  private _queryUserExists = async (phone: string) => {
    return this._service.queryUserExists(phone);
  };
  private readonly refreshTokenKeyPrefix = 'auth:refresh-token:';

  /** 创建并持久化一次性 refresh token 会话，刷新后旧会话立即失效。 */
  private createTokenPair = async (userId: string) => {
    const tokenId = randomUUID();
    const refreshToken = jwtConfig.signRefreshToken({ userId, tokenId });
    await redisClient.set(`${this.refreshTokenKeyPrefix}${tokenId}`, userId, {
      EX: appEnvConfig.jwt.refreshExpiresInSeconds
    });

    return {
      token: jwtConfig.signAccessToken({ userId }),
      refreshToken
    };
  };
  /**
   * 注册参数验证
   * */
  static validateRegister = validateMiddleware({ body: authSchemas.body.register });
  /**
   * 登录参数验证
   * */
  static validateLogin = validateMiddleware({ body: authSchemas.body.login });
  /** 刷新令牌参数验证 */
  static validateRefresh = validateMiddleware({ body: authSchemas.body.refresh });
  /**
   * 删除
   * */
  static validateDelete = validateMiddleware({ params: authSchemas.params.delete });

  /**
   * 登录
   * 手机号+密码
   * @param request - 请求对象
   * @param response - 响应对象
   * */
  login = async (request: Request, response: Response) => {
    const body = request.body as AuthLoginBody;
    const data = await this._service.queryUserInfo(body.phone);

    // 如果用户不存在
    if (!data) {
      return this.fail(APP_ENUMS.Auth.USER_NOT_FOUND_PHONE);
    }
    const { password, ...result } = data;

    // 验证密码
    const isPasswordValid = await bcrypt.compare(body.password, password);
    if (!isPasswordValid) {
      return this.fail(APP_ENUMS.Auth.PASSWORD_ERROR);
    }

    // 生成 token
    const tokenPair = await this.createTokenPair(result.userId);

    return this.success(response, { ...result, ...tokenPair });
  };
  /**
   * 删除用户
   * @param request - 请求对象
   * @param response - 响应对象
   * */
  delete = async (request: Request, response: Response) => {
    const userId = request.user?.userId;

    if (!userId) {
      return this.fail(APP_ENUMS.Auth.DELETE_USER_FAILED);
    }

    await this._service.deleteUser(userId);

    return this.success(response, { message: '删除成功' });
  };
  /**
   * 注册
   * @param request - 请求对象
   * @param response - 响应对象
   * */
  register = async (request: Request, response: Response) => {
    const { password, phone } = request.body as AuthRegisterBody;

    // 查询用户是否存在
    const isExists = await this._queryUserExists(phone);

    // 如果用户存在
    if (isExists) {
      this.fail(APP_ENUMS.Auth.PHONE_EXISTS);
    }
    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);
    // 生成用户ID
    const userId = generateSnowflake();

    // 存储用户
    const result = await this._service.createUser(userId, phone, hashedPassword);
    // 生成 token
    const tokenPair = await this.createTokenPair(result.userId);

    return this.success(response, { ...result, ...tokenPair });
  };
  /**
   * 登出
   * @param request - 请求对象
   * @param response - 响应对象
   * */
  logout = async () => {};
  /**
   * 刷新 token
   * @param request - 请求对象
   * @param response - 响应对象
   * */
  refreshToken = async (request: Request, response: Response) => {
    const { refreshToken } = request.body as AuthRefreshBody;

    try {
      const { userId, tokenId } = jwtConfig.verifyRefreshToken(refreshToken);
      const storedUserId = await redisClient.getDel(`${this.refreshTokenKeyPrefix}${tokenId}`);

      if (storedUserId !== userId) {
        return this.fail(APP_ENUMS.Auth.AUTH_FAILED, '刷新令牌已失效', HttpCodeEnum.UNAUTHORIZED);
      }

      return this.success(response, await this.createTokenPair(userId));
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return this.fail(APP_ENUMS.Auth.TOKEN_EXPIRED, '刷新令牌已过期', HttpCodeEnum.UNAUTHORIZED);
      }
      if (error instanceof BusinessError) {
        throw error;
      }
      return this.fail(APP_ENUMS.Auth.AUTH_FAILED, '刷新令牌无效', HttpCodeEnum.UNAUTHORIZED);
    }
  };
}
