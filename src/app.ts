// src/app.ts
import express from 'express';
import { createRouter } from '@/routes/index.js';
import * as appMiddlewares from '@/middlewares/index.js';

const app = express();

// 设置安全头
app.use(appMiddlewares.helmetMiddleware);
// 允许跨域
app.use(appMiddlewares.corsMiddleware);
// 解析 application/json
app.use(express.json());
// 解析 application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// 请求上下文
app.use(appMiddlewares.requestContextMiddleware);
// 自定义日志中间件
app.use(appMiddlewares.morganLogger());

// 路由挂载（版本控制）
createRouter(app);

// 404
app.use(appMiddlewares.notFoundHandlerMiddleware);
// 错误处理
app.use(appMiddlewares.errorHandlerMiddleware);

export { app };
