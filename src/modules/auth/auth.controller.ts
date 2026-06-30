// src/modules/auth/auth.controller.ts
import { Controller } from '@/utils/response.js';
import { AuthService } from './auth.service.js';
import { Request, Response } from 'express';
import { validateMiddleware } from '@/middlewares/validate.js';
import { AuthRegisterBody, authRegisterSchema } from '@/modules/auth/auth.schema.js';
import { APP_ENUMS } from '@/enums/index.js';
import bcrypt from 'bcrypt';
import { generateSnowflake } from '@/utils/snowflake.js';

// 手机号+验证码，邮箱+密码，用户名+密码

export class AuthController extends Controller {
  // 服务实例
  private readonly _service = new AuthService();
  // 注册参数验证
  static validateRegister = validateMiddleware({ body: authRegisterSchema });
  /**
   * 验证码
   * */
  verificationCode = async (req: Request, res: Response) => {
    // const { email } = req.body;
    // return this._service.verificationCode(email);
  };
  /**
   * 登录
   * */
  login = async (req: Request, res: Response) => {
    // const { username, password } = req.body;
    // return this._service.login(username, password);
    // return 'auth controller';

    const data = { message: 'auth controller' };
    return this.success(res, data);
  };

  /**
   * 刷新 token
   * */
  refreshToken = async () => {};

  /**
   * 注册
   * */
  register = async (req: Request, response: Response) => {
    const body = req.body as AuthRegisterBody;
    // 查询用户是否存在
    const isExists = await this._service.queryUserExists(body.phone);
    // 如果用户存在
    if (isExists) {
      return this.fail(APP_ENUMS.Auth.PHONE_EXISTS);
    }
    // 密码加密
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // 生成用户ID
    const userId = generateSnowflake();

    // 存储用户
    const result = await this._service.createUser(userId, body.phone, hashedPassword);

    return this.success(response, result);
  };
}
