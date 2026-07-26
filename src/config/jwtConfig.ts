import jwt from 'jsonwebtoken';
import { appEnvConfig } from '@/env/index.js';

export type AccessTokenPayload = { userId: string; tokenId: string };
export type RefreshTokenPayload = AccessTokenPayload & { tokenId: string };

const signAccessToken = (payload: AccessTokenPayload) =>
  jwt.sign(payload, appEnvConfig.jwt.secret, {
    expiresIn: appEnvConfig.jwt.expiresIn
  } as jwt.SignOptions);

const verifyAccessToken = (token: string) => jwt.verify(token, appEnvConfig.jwt.secret) as AccessTokenPayload;

/** 返回 access token 的剩余有效秒数，用于登出黑名单的 TTL。 */
const getAccessTokenRemainingSeconds = (token: string) => {
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded === 'string' || !decoded.exp) {
    return 0;
  }

  return Math.max(0, decoded.exp - Math.floor(Date.now() / 1000));
};

const signRefreshToken = (payload: RefreshTokenPayload) =>
  jwt.sign(payload, appEnvConfig.jwt.refreshSecret, {
    expiresIn: appEnvConfig.jwt.refreshExpiresIn,
    audience: 'refresh'
  } as jwt.SignOptions);

const verifyRefreshToken = (token: string) =>
  jwt.verify(token, appEnvConfig.jwt.refreshSecret, { audience: 'refresh' }) as RefreshTokenPayload;

export const jwtConfig = {
  signAccessToken,
  verifyAccessToken,
  getAccessTokenRemainingSeconds,
  signRefreshToken,
  verifyRefreshToken
};
