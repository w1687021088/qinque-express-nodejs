// src/middlewares/error.ts
import { NextFunction, Request, Response } from 'express';
import { BusinessError } from '@/utils/error.js';
import { ResponseFormatter } from '@/utils/responseFormatter.js';
import logger from '@/utils/logger.js';
import { HttpCodeEnum } from '@/enums/code/http-code.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandlerMiddleware = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  // 获取请求上下文（包含 url、method、query、body、ip 等）
  const context = req.context || {};

  if (err instanceof BusinessError) {
    // 业务错误：记录 warn 级别日志，带上上下文
    logger[err.statusCode === HttpCodeEnum.INTERNAL_SERVER_ERROR ? 'error' : 'warn']('[业务错误]', {
      ...context, // 展开上下文信息
      stack: (err as Error)?.stack
    });
    return ResponseFormatter.error(res, err.code, err.message, err.statusCode || HttpCodeEnum.INTERNAL_SERVER_ERROR);
  }

  // 系统错误：记录 error 级别日志，带上完整上下文和堆栈
  logger.error(`[系统错误] ${(err as Error)?.message}`, {
    ...context,
    stack: (err as Error)?.stack
  });

  return ResponseFormatter.error(res, HttpCodeEnum.INTERNAL_SERVER_ERROR, '服务器繁忙，请稍后再试');
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const notFoundHandlerMiddleware = (req: Request, res: Response, _next: NextFunction) => {
  // 404 也可以记录日志，方便统计未匹配的路由
  const context = req.context || {};
  logger.warn('[404 Not Found]', context);

  return ResponseFormatter.error(res, HttpCodeEnum.UNAUTHORIZED, 'Not Found', HttpCodeEnum.NOT_FOUND);
};
