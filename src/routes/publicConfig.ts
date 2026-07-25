// src/routes/publicConfig.ts
import { authRouter } from '@/modules/auth/auth.route.js';
import { AppRoutes } from '@/routes/create-routes.js';

export const publicConfigRoutes: AppRoutes = [
  {
    path: '/auth',
    config: authRouter,
    description: '认证模块'
  }
  // 健康检查、静态资源等公开接口
];
