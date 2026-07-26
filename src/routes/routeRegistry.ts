// src/routes/routeRegistry.ts
import { authRouter } from '@/modules/auth/auth.route.js';
import { userRouter } from '@/modules/user/user.route.js';
import { AppRoutes } from '@/routes/createRoutes.js';

/**
 * API 模块注册表。
 * 接口的公开或鉴权策略由各模块的 RouterConfig.access 声明，避免以模块目录决定安全边界。
 */
export const routeRegistry: AppRoutes = [
  {
    path: '/auth',
    config: authRouter,
    description: '认证模块'
  },
  {
    path: '/user',
    config: userRouter,
    description: '用户模块'
  }
];
