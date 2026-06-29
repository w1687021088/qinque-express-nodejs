import jwt from 'jsonwebtoken';

// JWT 验证
const verify = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return jwt.verify(token, secret) as { id: number; username: string };
};

// JWT 签名
const sign = (payload: { id: number; username: string }) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return jwt.sign(payload, secret, { expiresIn: '1d' });
};

export const jwtConfig = { verify, sign };
