// src/utils/error.ts
import { ErrorMessages } from '@/enums/code/index.js';

export class BusinessError extends Error {
  public code: number;
  public statusCode: number;

  constructor(code: number, message?: string, statusCode: number = 200) {
    // 如果传入了 message，使用传入的；否则从映射表中取默认消息
    const finalMessage = message || ErrorMessages[code] || '未知错误';
    super(finalMessage);
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, BusinessError.prototype);
  }
}
