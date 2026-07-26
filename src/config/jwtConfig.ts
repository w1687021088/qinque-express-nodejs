import jwt from 'jsonwebtoken';
import { appEnvConfig } from '@/env/index.js';

export type AccessTokenPayload = { userId: string };
export type RefreshTokenPayload = AccessTokenPayload & { tokenId: string };

const signAccessToken = (payload: AccessTokenPayload) =>
  jwt.sign(payload, appEnvConfig.jwt.secret, {
    expiresIn: appEnvConfig.jwt.expiresIn
  } as jwt.SignOptions);

const verifyAccessToken = (token: string) => jwt.verify(token, appEnvConfig.jwt.secret) as AccessTokenPayload;

const signRefreshToken = (payload: RefreshTokenPayload) =>
  jwt.sign(payload, appEnvConfig.jwt.refreshSecret, {
    expiresIn: appEnvConfig.jwt.refreshExpiresIn,
    audience: 'refresh'
  } as jwt.SignOptions);

const verifyRefreshToken = (token: string) =>
  jwt.verify(token, appEnvConfig.jwt.refreshSecret, { audience: 'refresh' }) as RefreshTokenPayload;

export const jwtConfig = { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken };
