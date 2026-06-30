// src/modules/auth/auth.types.ts
/**
 * @enum AuthUserInfo
 * 用户信息
 * */
export interface AuthUserInfo {
  /** 用户ID */
  userId: string;
  /** 手机号 */
  phone: string;
  /** 用户名 */
  username: string;
  /** 创建时间 */
  createdAt: Date;
}

/**
 * @enum AuthUserWithPassword
 * 用户信息，包含密码
 * */
export type AuthUserWithPassword = AuthUserInfo & { password: string };
