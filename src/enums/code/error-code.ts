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
  AUTH_FAILED = 10004,
  /**
   * 该手机号码已被注册
   */
  PHONE_EXISTS = 10005,
  /**
   * 用户不存在
   */
  USER_NOT_FOUND_PHONE = 10006,
  /**
   * 登录密码错误
   */
  PASSWORD_ERROR = 10007,
  /**
   * 用户出错
   */
  USER_NOT_FOUND = 10008,
  /**
   * 删除用户失败
   */
  DELETE_USER_FAILED = 10009
}

/**
 * User Error Code
 */
export enum UserErrorCode {
  /**
   * 用户不存在
   */
  USER_NOT_FOUND = 20002
}
