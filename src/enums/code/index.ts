// src/enums/code/index.ts

import { AppErrorCode, AuthErrorCode, UserErrorCode } from './error-code.js';

enum AppCode {
  /**
   * Success
   */
  SUCCESS = 200,
  /**
   * 参数不合法
   */
  PARAM_VALIDATE_FAILED = 20001
}

export const APP_ENUMS = {
  // App Error Code
  error: AppErrorCode,
  // App Code
  Code: AppCode,
  // User Error Code
  User: UserErrorCode,
  // Auth Error Code
  Auth: AuthErrorCode
};

// ---------- 错误码 -> 默认消息映射 ----------
export const ErrorMessages: Record<number, string> = {
  // ---------- Auth ----------
  [APP_ENUMS.Auth.INVALID_TOKEN]: '无效的 Token',
  [APP_ENUMS.Auth.TOKEN_EXPIRED]: 'Token 已过期，请重新登录',
  [APP_ENUMS.Auth.NOT_LOGGED_IN]: '未登录，请先登录',
  [APP_ENUMS.Auth.AUTH_FAILED]: '认证失败',
  [APP_ENUMS.Auth.PHONE_EXISTS]: '该用户已注册',
  [APP_ENUMS.Auth.USER_NOT_FOUND_PHONE]: '用户不存在',
  [APP_ENUMS.Auth.PASSWORD_ERROR]: '登录密码错误',
  // ---------- User ----------
  [APP_ENUMS.Code.PARAM_VALIDATE_FAILED]: '参数校验失败',
  [APP_ENUMS.User.USER_NOT_FOUND]: '用户不存在'
};
