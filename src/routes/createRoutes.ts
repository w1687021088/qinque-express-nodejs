// src/routes/create-routes.ts
import express from 'express';
import { z } from 'zod';
import { authMiddleware } from '@/middlewares/auth.js';

export type RouteAccess = 'public' | 'authenticated';
export type RouteMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

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
  body?: z.ZodType;
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
  result?: z.ZodType;
};

/**
 * 路由文档类型
 * */

export type RouterDoc = Omit<RouterConfig, 'handler' | 'middlewares'>;

/**
 * 路由配置类型
 * */

export type RouteConfig = {
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
export type AppRoute = {
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
  method: RouteMethod;
  /**
   * 访问策略。默认要求登录，公开接口必须显式声明。
   */
  access?: RouteAccess;
  /**
   * 中间件
   * */
  middlewares?: express.RequestHandler[];
  /**
   * 处理函数
   * */
  handler: express.RequestHandler;
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
export type AppRoutes = Array<AppRoute>;

// 创建应用路由
export function createAppRoutes(
  routerConfigs: RouterConfig[],
  middlewares: express.RequestHandler[] = []
): RouteConfig {
  // 创建路由
  const router = express.Router();

  // 使用中间件
  if (middlewares.length) {
    middlewares.forEach(middleware => router.use(middleware));
  }

  const docs: RouterDocsApi = [];

  // 创建路由
  routerConfigs.forEach(config => {
    const access = config.access ?? 'authenticated';
    const handlers = [...(access === 'authenticated' ? [authMiddleware] : []), ...(config.middlewares || [])];
    // 将 handler 作为最后一个中间件加入执行链
    router[config.method](config.path, ...handlers, config.handler);

    docs.push({
      path: config.path,
      method: config.method,
      access: config.access,
      schemas: config.schemas
    });
  });
  // 返回路由
  return { router, docs };
}
