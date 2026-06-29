// src/enums/code/index.ts

import { AppErrorCode, UserErrorCode } from './error-code.js';

enum AppCode {
  /**
   * Success
   */
  SUCCESS = 200,
  /**
   * 404
   */
  NOT_FOUND = 404,
  /**
   * 500
   */
  INTERNAL_SERVER_ERROR = 500
}

export const APP_ENUMS = {
  // App Error Code
  error: AppErrorCode,
  // App Code
  Code: AppCode,
  // User Error Code
  User: UserErrorCode
};

// ---------- 错误码 -> 默认消息映射 ----------
export const ErrorMessages: Record<number, string> = {
  [APP_ENUMS.error.TOKEN_EXPIRED]: 'Token 已过期，请重新登录',
  [APP_ENUMS.User.PARAM_VALIDATE_FAILED]: '参数校验失败',
  [APP_ENUMS.User.USER_NOT_FOUND]: '用户不存在'
};
