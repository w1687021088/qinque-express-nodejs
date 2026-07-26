// src/middlewares/logger.ts

import morgan from 'morgan';
import logger from '@/utils/logger.js';

// 把 morgan 的输出接到 winston
const stream = { write: (msg: string) => logger.info('HTTP 请求完成', { message: msg.trim() }) };

export const morganLogger = () => morgan('combined', { stream });
