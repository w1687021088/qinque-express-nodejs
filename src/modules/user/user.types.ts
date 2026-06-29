import { Player } from './user.schema.js';
import { ReqQuery } from '@/types/request.js';
import { z } from 'zod';

export type UserQueryPlayer = ReqQuery<z.infer<typeof Player>>;
