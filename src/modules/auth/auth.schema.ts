// src/modules/auth/auth.schema.ts
import { z } from 'zod';

// 注册
export const authRegisterSchema = z
  .object({
    phone: z
      .string({
        error: '手机号不能为空'
      })
      .regex(/^1[3-9]\d{9}$/, {
        message: '请输入有效的手机号码'
      }),
    password: z
      .string({
        error: '密码不能为空'
      })
      .min(8, '密码至少 8 位')
      .regex(/[A-Za-z]/, '密码必须包含至少一个字母')
      .regex(/\d/, '密码必须包含至少一个数字'),
    confirmPassword: z
      .string({
        error: '请再次输入密码'
      })
      .min(8, '密码至少 8 位')
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'] // 错误会关联到 confirmPassword 字段
  });

// 登录
export const authLoginSchema = z.object({
  phone: z
    .string({
      error: '手机号不能为空'
    })
    .regex(/^1[3-9]\d{9}$/, {
      message: '请输入有效的手机号码'
    }),
  password: z.string({
    error: '密码不能为空'
  })
});

// 注册参数类型
export type AuthRegisterBody = z.infer<typeof authRegisterSchema>;

// 登录参数类型
export type AuthLoginBody = z.infer<typeof authLoginSchema>;
