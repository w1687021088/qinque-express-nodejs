import { RequestHandler } from 'express';
import { appEnvConfig } from '@/env/index.js';
import { createAppRoutes } from '@/routes/createRoutes.js';
import { getApplicationReady } from '@/utils/readiness.js';

const live: RequestHandler = (_request, response) => {
  response.status(200).json({ status: 'ok' });
};

const ready: RequestHandler = (_request, response) => {
  const isReady = getApplicationReady();
  response.status(isReady ? 200 : 503).json({
    status: isReady ? 'ok' : 'not_ready',
    service: appEnvConfig.appName,
    environment: appEnvConfig.env
  });
};

/**
 * 健康检查不使用统一业务响应信封，方便负载均衡与编排平台以最小成本解析。
 */
export const healthRouter = createAppRoutes([
  {
    path: '/live',
    method: 'get',
    access: 'public',
    handler: live,
    schemas: {
      summary: '存活检查',
      description: '仅表示 HTTP 进程仍在运行'
    }
  },
  {
    path: '/ready',
    method: 'get',
    access: 'public',
    handler: ready,
    schemas: {
      summary: '就绪检查',
      description: '表示服务已完成启动并可接收流量'
    }
  }
]);
