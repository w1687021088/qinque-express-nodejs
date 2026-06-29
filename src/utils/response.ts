// src/utils/response.ts
import { Response } from 'express';
import { ResponseFormatter } from './responseFormatter.js';
import { BusinessError } from './error.js';
import { APP_ENUMS } from '@/enums/index.js';

export class Controller {
  /**
   * 成功响应
   */
  success<T>(res: Response, data: T, message = 'success') {
    return ResponseFormatter.success(res, data, message);
  }

  /**
   * 抛出业务错误（自动匹配默认消息）
   * @param code 错误码（来自 APP_ENUMS.User 等）
   * @param message 可选自定义消息，不传则使用默认
   * @param status HTTP 状态码，默认 200
   */
  fail(code: number, message?: string, status: number = APP_ENUMS.Code.SUCCESS) {
    throw new BusinessError(code, message, status);
  }
}
