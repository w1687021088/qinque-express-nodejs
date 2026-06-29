// src/modules/user/user.controller.ts
import { Request, Response } from 'express';
import { Controller } from '@/utils/response.js';
import { UserService } from './user.service.js';
import { validateMiddleware } from '@/middlewares/validate.js';
import { Player } from '@/modules/user/user.schema.js';
import { APP_ENUMS } from '@/enums/index.js';
import { UserQueryPlayer } from '@/modules/user/user.types.js';

export class UserController extends Controller {
  /*** 模块名称 */
  // private readonly _name: string = 'userApi';
  /*** 服务实例 */
  private _userService = new UserService();

  constructor() {
    super();
  }

  // 静态方法，用于参数验证
  static validateInfo = validateMiddleware({ query: Player }, APP_ENUMS.User.PARAM_VALIDATE_FAILED);

  /**
   * 获取用户信息
   * */
  apiInfo = async (req: unknown, res: Response) => {
    const query = (req as unknown as UserQueryPlayer).query;
    const data = await this._userService.findById(query.username);
    if (!data) return this.fail(APP_ENUMS.User.USER_NOT_FOUND);
    return this.success(res, data);
  };

  /**
   * 创建用户
   * */
  apiAdded = async (req: Request, res: Response) => {
    console.log(req);
    return this.success(res, { name: 'zjw' });
  };
}
