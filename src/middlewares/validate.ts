import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';
import { BusinessError } from '@/utils/error.js';
import { APP_ENUMS } from '@/enums/index.js';
import { HttpCodeEnum } from '@/enums/code/http-code.js';

type Sources = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

export const validateMiddleware = (
  schemas: Sources,
  code: number = APP_ENUMS.Code.PARAM_VALIDATE_FAILED,
  statusCode: HttpCodeEnum = HttpCodeEnum.BAD_REQUEST
) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        const parsed = await schemas.body.parseAsync(req.body);
        Object.assign(req.body, parsed);
      }
      if (schemas.query) {
        const parsed = await schemas.query.parseAsync(req.query);
        Object.assign(req.query, parsed);
      }
      if (schemas.params) {
        const parsed = await schemas.params.parseAsync(req.params);
        Object.assign(req.params, parsed);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        next(new BusinessError(code, `参数不合法: ${message}`, statusCode));
      } else {
        next(error);
      }
    }
  };
};
