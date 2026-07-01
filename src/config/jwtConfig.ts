import jwt from 'jsonwebtoken';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// JWT 验证
const verify = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return jwt.verify(token, secret) as { userId: string };
};

// JWT 签名
const sign = (payload: { userId: string }) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return jwt.sign(payload, secret, {
    expiresIn: JWT_EXPIRES_IN
  } as jwt.SignOptions);
};

export const jwtConfig = { verify, sign };
