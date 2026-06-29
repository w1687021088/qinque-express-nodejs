// src/middlewares/helmet.ts
import helmet from 'helmet';
import { appEnvConfig } from '@/env/index.js';

/**
 * Helmet 安全头配置
 * - 生产环境：启用所有默认安全策略
 * - 开发环境：放宽 CSP，避免干扰前端热更新
 */
const helmetOptions = {
  // 内容安全策略（CSP）
  contentSecurityPolicy: appEnvConfig.isDev
    ? {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"], // 开发环境允许内联脚本
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:']
        }
      }
    : undefined // 生产环境使用默认值（更严格）
};

export const helmetMiddleware = helmet(helmetOptions);
