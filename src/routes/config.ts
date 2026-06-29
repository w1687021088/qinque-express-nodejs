import { userRouter } from '@/modules/user/user.route.js';

enum RouterPathEnum {
  /**
   * 用户路由
   * */
  USER = '/user'
}

export const configRoutes = [
  {
    path: RouterPathEnum.USER,
    router: userRouter
  }
];
