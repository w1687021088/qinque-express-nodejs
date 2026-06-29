// src/routes/publicConfig.ts
import { authRouter } from '@/modules/auth/auth.route.js';

export const publicConfigRoutes = [
  {
    path: '/auth',
    router: authRouter
  }
  // 健康检查、静态资源等公开接口
];
