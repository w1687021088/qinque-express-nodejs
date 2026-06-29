// src/utils/responseFormatter.ts
import { Response } from 'express';
import { APP_ENUMS } from '@/enums/index.js';
import { HttpCodeEnum } from '@/enums/code/http-code.js';

/**
 * 统一响应格式工具
 * 自动注入 requestId 和 timestamp
 */
export class ResponseFormatter {
  /**
   * 成功响应
   */
  static success<T>(res: Response, data: T, message: string = 'success', statusCode: number = HttpCodeEnum.OK) {
    return res.status(statusCode).json({
      code: APP_ENUMS.Code.SUCCESS,
      message,
      data,
      requestId: (res.req as any).context?.requestId,
      timestamp: Date.now()
    });
  }

  /**
   * 错误响应（由 errorHandler 调用）
   */
  static error(res: Response, code: number, message: string, statusCode: number = HttpCodeEnum.OK) {
    return res.status(statusCode).json({
      code,
      message,
      data: null,
      requestId: (res.req as any).context?.requestId,
      timestamp: Date.now()
    });
  }
}
