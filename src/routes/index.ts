import express from 'express';
import { configRoutes } from './config.js';

const rootRouter = express.Router();

/**
 * 创建路由
 * */
export const createRouter = (app: express.Express) => {
  configRoutes.forEach(route => {
    rootRouter.use(route.path, route.router);
  });

  app.use(version, rootRouter);

  return app;
};

const version = '/api/v1';
