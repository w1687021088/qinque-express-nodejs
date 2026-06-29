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
  origin: appEnvConfig.isDev
    ? '*' // 开发环境允许所有源
    : appEnvConfig.apiUrl || 'https://yourdomain.com', // 生产环境限制具体域名

  // 2. 允许的 HTTP 方法
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

  // 3. 允许的请求头（前端可携带的 header）
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],

  // 4. 是否允许携带凭证（如 Cookie）
  credentials: true,

  // 5. 预检请求（OPTIONS）的缓存时间（秒）
  maxAge: 86400 // 24 小时
};

// 导出配置好的 CORS 中间件
export const corsMiddleware = cors(corsOptions);
