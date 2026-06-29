// src/enums/code/error-code.ts

/**
 * App Error Code
 */
export enum AppErrorCode {}

/**
 * Auth Error Code
 * */
export enum AuthErrorCode {
  /**
   * 未登录，请先登录
   */
  NOT_LOGGED_IN = 10001,
  /**
   * Token 已过期，请重新登录
   */
  TOKEN_EXPIRED = 10002,
  /**
   * 无效的 Token
   */
  INVALID_TOKEN = 10003,
  /**
   * 认证失败
   */
  AUTH_FAILED = 10004
}

/**
 * User Error Code
 */
export enum UserErrorCode {
  /**
   * 参数不合法
   */
  PARAM_VALIDATE_FAILED = 20001,
  /**
   * 用户不存在
   */
  USER_NOT_FOUND = 20002
}
