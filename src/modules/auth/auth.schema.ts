import { z } from 'zod';

export const authSchemas = {
  body: {
    // 注册
    register: z
      .object({
        phone: z
          .string({
            error: '手机号不能为空'
          })
          .regex(/^1[3-9]\d{9}$/, {
            message: '请输入有效的手机号码'
          })
          .describe('中国大陆手机号，11位数字，以1开头，第二位3-9'), // ✅ 添加注释

        password: z
          .string({
            error: '密码不能为空'
          })
          .min(8, '密码至少 8 位')
          .regex(/[A-Za-z]/, '密码必须包含至少一个字母')
          .regex(/\d/, '密码必须包含至少一个数字')
          .describe('密码至少8位，必须包含字母和数字'), // ✅ 添加注释

        confirmPassword: z
          .string({
            error: '请再次输入密码'
          })
          .min(8, '密码至少 8 位')
          .describe('再次输入密码，需与密码一致') // ✅ 添加注释
      })
      .refine(data => data.password === data.confirmPassword, {
        message: '两次输入的密码不一致',
        path: ['confirmPassword']
      }),
    // 登录
    login: z.object({
      phone: z
        .string({
          error: '手机号不能为空'
        })
        .regex(/^1[3-9]\d{9}$/, {
          message: '请输入有效的手机号码'
        })
        .describe('中国大陆手机号，11位数字'), // ✅ 添加注释

      password: z
        .string({
          error: '密码不能为空'
        })
        .describe('登录密码（至少8位，含字母和数字）') // ✅ 添加注释
    })
  },
  params: {
    delete: z.object({
      userId: z.string().describe('用户ID（必填）')
    })
  },
  result: {
    register: z.object({
      userId: z.string().describe('用户ID'),
      username: z.string().describe('用户名'),
      phone: z.string().describe('手机号'),
      createdTime: z.number().describe('创建时间'),
      token: z.string().describe('token')
    }),
    login: z.object({
      userId: z.string().describe('用户ID'),
      username: z.string().describe('用户名'),
      phone: z.string().describe('手机号'),
      createdTime: z.number().describe('创建时间'),
      token: z.string().describe('token')
    }),
    delete: z.object({
      userId: z.string().describe('被删除的用户ID'),
      deletedAt: z.string().describe('删除时间（ISO格式）')
    })
  }
};

// 注册参数类型
export type AuthRegisterBody = z.infer<typeof authSchemas.body.register>;

// 登录参数类型
export type AuthLoginBody = z.infer<typeof authSchemas.body.login>;
