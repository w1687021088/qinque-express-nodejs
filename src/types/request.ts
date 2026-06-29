// src/types/request.ts
import { Request } from 'express';

// 只关心 Query 时用这个
export type ReqQuery<T> = Request<Record<string, any>, Record<string, any>, Record<string, any>, T>;

// 只关心 Body 时用这个
export type ReqBody<T> = Request<Record<string, any>, Record<string, any>, T>;

// 只关心 Params 时用这个
export type ReqParams<T> = Request<T>;

// 如果同时关心多个，用这个全能选手（带默认值）
export type Req<P = any, ResBody = any, ReqBody = any, Q = any> = Request<P, ResBody, ReqBody, Q>;
