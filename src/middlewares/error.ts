// src/middlewares/error.ts
import { NextFunction, Request, Response } from 'express';
import { BusinessError } from '@/utils/error.js';
import { ResponseFormatter } from '@/utils/responseFormatter.js';
import { APP_ENUMS } from '@/enums/index.js';
import logger from '@/utils/logger.js';

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  // 获取请求上下文（包含 url、method、query、body、ip 等）
  const context = req.context || {};

  if (err instanceof BusinessError) {
    // 业务错误：记录 warn 级别日志，带上上下文
    logger.warn('[业务错误]', {
      ...context, // 展开上下文信息
      stack: (err as Error)?.stack
    });
    return ResponseFormatter.error(res, err.code, err.message, err.statusCode || APP_ENUMS.Code.INTERNAL_SERVER_ERROR);
  }

  // 系统错误：记录 error 级别日志，带上完整上下文和堆栈
  logger.error(`[系统错误] ${(err as Error)?.message}`, {
    ...context,
    stack: (err as Error)?.stack
  });

  return ResponseFormatter.error(res, APP_ENUMS.Code.INTERNAL_SERVER_ERROR, '服务器繁忙，请稍后再试');
};

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
  // 404 也可以记录日志，方便统计未匹配的路由
  const context = req.context || {};
  logger.warn('[404 Not Found]', context);

  return ResponseFormatter.error(res, APP_ENUMS.Code.NOT_FOUND, 'Not Found', APP_ENUMS.Code.NOT_FOUND);
};
