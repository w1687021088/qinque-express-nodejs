// src/middlewares/requestContext.ts
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '@/utils/logger.js';

export const requestContextMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || req.socket.remoteAddress;

  req.context = {
    requestId,
    url: req.url,
    method: req.method,
    query: req.query,
    params: req.params,
    body: req.body,
    ip
  };

  res.setHeader('X-Request-Id', requestId);
  logger.defaultMeta = { ...logger.defaultMeta, requestId };
  next();
};
