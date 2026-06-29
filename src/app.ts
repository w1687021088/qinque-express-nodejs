// src/app.ts
import './types/express.d.ts';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createRouter } from '@/routes/index.js';
import * as appMiddlewares from '@/middlewares/index.js';

const app = express();

// 设置安全头
app.use(helmet());
// 允许跨域
app.use(cors());
// 解析 application/json
app.use(express.json());
// 解析 application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// 请求上下文
app.use(appMiddlewares.requestContext);
// 自定义日志中间件
app.use(appMiddlewares.morganLogger());

// 路由挂载（版本控制）
createRouter(app);

// 404
app.use(appMiddlewares.notFoundHandler);
// 错误处理
app.use(appMiddlewares.errorHandler);

export { app };
