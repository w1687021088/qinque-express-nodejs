// src/modules/auth/auth.route.ts
import { createAppRoutes } from '@/routes/create-routes.js';
import { AuthController } from './auth.controller.js';
import { authMiddleware } from '@/middlewares/auth.js';

const authController = new AuthController();

export const authRouter = createAppRoutes([
  // 登录
  {
    path: '/login',
    method: 'post',
    handler: authController.login,
    middlewares: [AuthController.validateLogin]
  },
  // 刷新token
  {
    path: '/refresh',
    method: 'get',
    handler: authController.refreshToken
  },
  // 注册
  {
    path: '/register',
    method: 'post',
    handler: authController.register,
    middlewares: [AuthController.validateRegister]
  },
  // 删除
  {
    path: '/delete',
    method: 'post',
    handler: authController.delete,
    middlewares: [authMiddleware]
  },
  // 登出
  {
    path: '/logout',
    method: 'post',
    handler: authController.logout
  }
]);
