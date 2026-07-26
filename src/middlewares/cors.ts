// src/middlewares/cors.ts
import cors from 'cors';
import { appEnvConfig } from '@/env/index.js';

/**
 * CORS 配置选项
 * 根据环境自动切换：
 * - 开发环境：允许所有来源（*），方便调试
 * - 非开发环境：限制特定域名，增强安全性
 */
const corsOptions: cors.CorsOptions = {
  // 1. 来源控制
  // credentials 为 true 时不能返回通配来源 *；true 会回显请求来源，仅用于开发环境。
  origin: appEnvConfig.isDev ? true : appEnvConfig.corsOrigins,

  // 2. 允许的 HTTP 方法
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  // 3. 允许的请求头（前端可携带的 header）
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-Id'],

  // 4. 是否允许携带凭证（如 Cookie）
  credentials: true,

  // 5. 预检请求（OPTIONS）的缓存时间（秒）
  maxAge: 86400 // 24 小时
};

// 导出配置好的 CORS 中间件
export const corsMiddleware = cors(corsOptions);
