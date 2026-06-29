// src/modules/auth/auth.route.ts
import { createAppRoutes } from '@/routes/create-routes.js';

export const authRouter = createAppRoutes([
  // 登录
  {
    path: '/login',
    method: 'post',
    handler: () => {}
  },
  // 刷新 token
  {
    path: '/refreshToken',
    method: 'post',
    handler: () => {}
  },
  // 注册
  {
    path: '/register',
    method: 'post',
    handler: () => {}
  }
]);
