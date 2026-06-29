// src/middlewares/requestContext.ts
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '@/utils/logger.js';

export const requestContextMiddleware = (req: Request, res: Response, next: NextFunction) => {
  //  获取请求 ID
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();

  // 获取客户端 IP 地址
  req.context = {
    requestId,
    // 获取请求 URL
    url: req.url,
    // 获取请求方法
    method: req.method,
    // 获取查询参数
    query: req.query,
    // 获取请求体
    body: req.body,
    // 获取请求参数
    params: req.params,
    // 获取请求体
    headers: req.headers,
    ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || req.socket.remoteAddress
  };

  res.setHeader('X-Request-Id', requestId);

  logger.defaultMeta = { ...logger.defaultMeta, requestId };

  next();
};
