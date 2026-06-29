import { z } from 'zod';

export const Player = z.object({
  username: z.string({ error: '用户名不能为空' }).min(1, '用户名至少1个字符'),
  id: z.coerce.number({ error: '用户 ID 必须为数字' }).int().positive('ID 必须为正整数')
});
