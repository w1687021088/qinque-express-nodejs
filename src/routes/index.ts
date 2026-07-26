// src/routes/index.ts
import express from 'express';
import { routeRegistry } from './routeRegistry.js';
import { createSwaggerConfig } from '@/config/swagger.js';

const version = '/api/v1';

export const createRouter = (app: express.Express) => {
  // 每个应用实例创建独立路由树，避免测试或重复初始化时重复挂载。
  const rootRouter = express.Router();

  routeRegistry.forEach(({ path, config }) => {
    rootRouter.use(path, config.router);
  });

  app.use(version, rootRouter);

  return createSwaggerConfig(app, version, routeRegistry);
};
