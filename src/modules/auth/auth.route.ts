// src/modules/auth/auth.route.ts
import { createAppRoutes } from '@/routes/create-routes.js';
import { AuthController } from './auth.controller.js';

const authController = new AuthController();

export const authRouter = createAppRoutes([
  // 登录
  {
    path: '/login',
    method: 'post',
    handler: authController.login
  },
  // 刷新token
  {
    path: '/refreshToken',
    method: 'post',
    handler: authController.refreshToken
  },
  // 注册
  {
    path: '/register',
    method: 'post',
    handler: authController.register,
    middlewares: [AuthController.validateRegister]
  }
]);
