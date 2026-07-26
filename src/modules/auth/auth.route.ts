// src/modules/auth/auth.route.ts
import { createAppRoutes } from '@/routes/createRoutes.js';
import { AuthController } from './auth.controller.js';
import { authMiddleware } from '@/middlewares/auth.js';
import { authSchemas } from '@/modules/auth/auth.schema.js';

const authController = new AuthController();

export const authRouter = createAppRoutes([
  // 登录
  {
    path: '/login',
    method: 'post',
    handler: authController.login,
    middlewares: [AuthController.validateLogin],
    schemas: {
      description: '登录成功',
      summary: '用户登录',
      body: authSchemas.body.login,
      result: authSchemas.result.login
    }
  },
  // 刷新token
  {
    path: '/refresh',
    method: 'get',
    handler: authController.refreshToken,
    schemas: {
      description: '刷新token成功',
      summary: '刷新token'
    }
  },
  // 注册
  {
    path: '/register',
    method: 'post',
    handler: authController.register,
    middlewares: [AuthController.validateRegister],
    schemas: {
      description: '注册成功',
      summary: '用户注册',
      body: authSchemas.body.register,
      result: authSchemas.result.register
    }
  },
  // 删除
  {
    path: '/delete/:userId',
    method: 'delete',
    handler: authController.delete,
    middlewares: [authMiddleware, AuthController.validateDelete],
    schemas: {
      description: '删除成功',
      summary: '删除用户',
      params: authSchemas.params.delete,
      result: authSchemas.result.delete
    }
  },
  // 登出
  {
    path: '/logout',
    method: 'post',
    handler: authController.logout,
    middlewares: [authMiddleware],
    schemas: {
      description: '用户登出成功',
      summary: '用户登出'
    }
  }
]);
