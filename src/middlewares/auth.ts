// src/middlewares/auth.ts
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { BusinessError } from '@/utils/error.js';
import { APP_ENUMS } from '@/enums/index.js';
import { HttpCodeEnum } from '@/enums/code/http-code.js';
import { jwtConfig } from '@/config/jwtConfig.js';
import redisClient from '@/utils/redis.js';

const accessTokenBlocklistKeyPrefix = 'auth:access-token:blocklist:';

/**
 * JWT 认证中间件
 * 验证 token，将用户信息挂载到 req.user
 */
export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  // 1. 从 Authorization 头提取 token
  const authHeader = req.headers.authorization;
  // 1.1 没有 Authorization 头
  if (!authHeader) {
    return next(new BusinessError(APP_ENUMS.Auth.NOT_LOGGED_IN, null, HttpCodeEnum.UNAUTHORIZED));
  }
  // 1.2 Authorization 头格式错误
  if (!authHeader.startsWith('Bearer ')) {
    return next(new BusinessError(APP_ENUMS.Auth.INVALID_TOKEN, null, HttpCodeEnum.UNAUTHORIZED));
  }
  // 1.3 提取 token
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  // 2. 校验 token
  try {
    const user = jwtConfig.verifyAccessToken(token);
    const isBlocked = await redisClient.exists(`${accessTokenBlocklistKeyPrefix}${user.tokenId}`);
    if (isBlocked) {
      return next(new BusinessError(APP_ENUMS.Auth.AUTH_FAILED, '登录状态已失效', HttpCodeEnum.UNAUTHORIZED));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new BusinessError(APP_ENUMS.Auth.TOKEN_EXPIRED, null, HttpCodeEnum.UNAUTHORIZED));
    }
    // logger.error('JWT 校验异常', { error });
    return next(new BusinessError(APP_ENUMS.Auth.AUTH_FAILED, null, HttpCodeEnum.UNAUTHORIZED));
  }
};
