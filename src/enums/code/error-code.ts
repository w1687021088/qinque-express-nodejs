// src/enums/code/error-code.ts

/**
 * App Error Code
 */
export enum AppErrorCode {
  /**
   * token失效
   */
  TOKEN_EXPIRED = 10001
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
