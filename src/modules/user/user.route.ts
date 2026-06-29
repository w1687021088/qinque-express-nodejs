// src/modules/user/user.route.ts
import { UserController } from './user.controller.js';
import { createAppRoutes } from '@/routes/create-routes.js';

// 路由枚举
enum UserPathEnum {
  INFO = '/info',
  ADDED = '/added'
}

// 实例化控制器
const userController = new UserController();

export const userRouter = createAppRoutes(
  [
    // 获取用户信息
    {
      path: UserPathEnum.INFO,
      method: 'get',
      handler: userController.apiInfo,
      middlewares: [UserController.validateInfo]
    },
    // 创建用户
    {
      path: UserPathEnum.ADDED,
      method: 'get',
      handler: userController.apiAdded
    }
  ],
  [
    function (req, res, next) {
      return next();
    }
  ]
);
