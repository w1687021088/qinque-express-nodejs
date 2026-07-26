// src/routes/config.ts
import { userRouter } from '@/modules/user/user.route.js';
import { AppRoutes } from '@/routes/createRoutes.js';

enum RouterPathEnum {
  /**
   * 用户路由
   * */
  USER = '/user'
}

export const configRoutes: AppRoutes = [
  {
    path: RouterPathEnum.USER,
    config: userRouter,
    description: '用户模块'
  }
];
