// src/modules/user/user.controller.ts
import { Request, Response } from 'express';
import { Controller } from '@/utils/response.js';
import { UserService } from './user.service.js';
import { validate } from '@/middlewares/validate.js';
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
  static validateInfo = validate({ query: Player }, APP_ENUMS.User.PARAM_VALIDATE_FAILED);

  /**
   * 获取用户信息
   * */
  apiInfo = async (req: unknown, res: Response) => {
    this.fail(APP_ENUMS.User.USER_NOT_FOUND);
    const query = (req as unknown as UserQueryPlayer).query;
    await this._userService.findById(query.username);
    return this.success(res, { name: 'lyq' });
  };

  /**
   * 创建用户
   * */
  apiAdded = async (req: Request, res: Response) => {
    console.log(req);
    return this.success(res, { name: 'zjw' });
  };
}
