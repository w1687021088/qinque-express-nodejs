import express from 'express';

// 路由配置类型
export type RouterConfig = {
  // 路由路径
  path: string;
  // 请求方法
  method: 'get' | 'post' | 'put' | 'delete';
  // 中间件
  middlewares?: express.RequestHandler[];
  // 处理函数
  handler: (req: express.Request, res: express.Response) => void;
};

// 中间件类型
type middleware = (req: express.Request, res: express.Response, next: express.NextFunction) => unknown;

// 创建应用路由
export function createAppRoutes(routerConfigs: RouterConfig[], middleware?: middleware[]) {
  // 创建路由
  const router = express.Router();

  // 使用中间件
  if (middleware?.length) {
    middleware.forEach(m => router.use(m));
  }

  // 创建路由
  routerConfigs.forEach(config => {
    // 中间件
    const handlers = config.middlewares || [];
    // 将 handler 作为最后一个中间件加入执行链
    router[config.method](config.path, ...handlers, config.handler);
  });

  // 返回路由
  return router;
}
