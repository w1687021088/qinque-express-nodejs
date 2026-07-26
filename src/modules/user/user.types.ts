import { ReqQuery } from '@/types/request.js';
import { z } from 'zod';
import { userSchemas } from './user.schema.js';

export type UserQueryPlayer = ReqQuery<z.infer<typeof userSchemas.query.info>>;
