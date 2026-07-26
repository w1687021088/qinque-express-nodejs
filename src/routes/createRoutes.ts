// src/routes/create-routes.ts
import express from 'express';
import { z } from 'zod';

type Schema = {
  /**
   * 是否必填, 同时用于 swagger 文档生成
   * @type {boolean}
   * */
  required?: boolean;
  /**
   * 描述,同时用于 swagger 文档生成
   * @type {string}
   * */
  description?: string;
  /**
   * 请求参数验证，同时用于 swagger 文档生成
   * @type {z.ZodObject}
   * */
  summary?: string;
  /**
   * 路径参数验证，同时用于 swagger 文档生成
   * @type {z.ZodObject}
   * */
  body?: z.ZodObject;
  /**
   * 查询参数验证，同时用于 swagger 文档生成; 用于动态路由
   * @type {z.ZodObject}
   * */
  params?: z.ZodObject;
  /**
   * 查询参数验证，同时用于 swagger 文档生成；
   * @type {z.ZodObject}
   * */
  query?: z.ZodObject;
  /**
   * 响应结果验证，同时用于 swagger 文档生成
   * @type {z.ZodObject}
   * */
  result?: z.ZodObject;
};

/**
 * 路由文档类型
 * */

type RouterDoc = Omit<RouterConfig, 'handler' | 'middlewares'>;

// 中间件类型
type middleware = (req: express.Request, res: express.Response, next: express.NextFunction) => unknown;

/**
 * 路由配置类型
 * */

type RouteConfig = {
  /**
   * 路由
   * */
  router: express.Router;
  /**
   * 路由文档
   * */
  docs: RouterDocsApi;
};

/**
 * 路由配置类型
 * */
type Routes = {
  /**
   * 路由配置
   * */
  config: RouteConfig;
  /**
   * 路由路径
   * */
  path: string;
  /**
   * 描述
   * */
  description?: string;
};

/**
 * 路由配置类型
 * */
export type RouterConfig = {
  /**
   * 路由路径
   * */
  path: string;
  /**
   * 请求方法
   * */
  method: 'get' | 'post' | 'put' | 'delete';
  /**
   * 中间件
   * */
  middlewares?: express.RequestHandler[];
  /**
   * 处理函数
   * */
  handler: (req: express.Request, res: express.Response) => void;
  /**
   * 数据验证模式
   * */
  schemas?: Schema;
};

/**
 * 路由文档类型
 * */

export type RouterDocsApi = Array<RouterDoc>;

/**
 * 应用路由类型
 * */
export type AppRoutes = Array<Routes>;

// 创建应用路由
export function createAppRoutes(routerConfigs: RouterConfig[], middleware?: middleware[]): RouteConfig {
  // 创建路由
  const router = express.Router();

  // 使用中间件
  if (middleware?.length) {
    middleware.forEach(m => router.use(m));
  }

  const docs: RouterDocsApi = [];

  // 创建路由
  routerConfigs.forEach(config => {
    // 中间件
    const handlers = config.middlewares || [];
    // 将 handler 作为最后一个中间件加入执行链
    router[config.method](config.path, ...handlers, config.handler);

    docs.push({
      path: config.path,
      method: config.method,
      schemas: config.schemas
    });
  });
  // 返回路由
  return { router, docs };
}
