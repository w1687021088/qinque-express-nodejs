// src/middlewares/logger.ts
// import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import logger from '@/utils/logger.js';

// 纯函数中间件
// export const logger = (req: Request, _: Response, next: NextFunction) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
//   next();
// };

// 把 morgan 的输出接到 winston
const stream = { write: (msg: string) => logger.info(msg.trim()) };

export const morganLogger = () => morgan('combined', { stream });
