// src/routes/index.ts
import express from 'express';
import { authMiddleware } from '@/middlewares/auth.js';
import { configRoutes } from './config.js';
import { publicConfigRoutes } from './publicConfig.js';
import { createSwaggerConfig } from '@/config/swagger.js';

const rootRouter = express.Router();

const version = '/api/v1';

export const createRouter = (app: express.Express) => {
  // 1️⃣ 先挂载公开路由（不经过 JWT）
  publicConfigRoutes.forEach(({ path, config }) => {
    rootRouter.use(path, config.router);
  });

  // 2️⃣ 插入 JWT 中间件 → 后续所有路由都需要认证
  rootRouter.use(authMiddleware);

  // 3️⃣ 挂载受保护路由（需要 JWT）
  configRoutes.forEach(({ path, config }) => {
    rootRouter.use(path, config.router);
  });

  app.use(version, rootRouter);

  const allRoutes = [...publicConfigRoutes, ...configRoutes];

  return createSwaggerConfig(app, version, allRoutes);
};
