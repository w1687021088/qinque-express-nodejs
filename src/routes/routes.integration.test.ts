import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { app } from '@/app.js';
import { setApplicationReady } from '@/utils/readiness.js';

describe('路由访问策略与运行状态', () => {
  afterEach(() => {
    setApplicationReady(false);
  });

  it('公开接口不经过 JWT 鉴权，但仍执行输入校验', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({});

    expect(response.status).toBe(400);
    expect(response.body.code).toBe(20001);
  });

  it('默认接口缺少访问令牌时返回 401', async () => {
    const response = await request(app).get('/api/v1/user/info');

    expect(response.status).toBe(401);
  });

  it('登出接口需要有效访问令牌', async () => {
    const response = await request(app).post('/api/v1/auth/logout');

    expect(response.status).toBe(401);
  });

  it('刷新接口是公开端点且会校验 refreshToken 参数', async () => {
    const response = await request(app).post('/api/v1/auth/refresh').send({});

    expect(response.status).toBe(400);
    expect(response.body.code).toBe(20001);
  });

  it('存活检查始终可用，就绪检查反映应用初始化状态', async () => {
    const liveResponse = await request(app).get('/api/v1/health/live');
    const notReadyResponse = await request(app).get('/api/v1/health/ready');

    expect(liveResponse.status).toBe(200);
    expect(notReadyResponse.status).toBe(503);

    setApplicationReady(true);
    const readyResponse = await request(app).get('/api/v1/health/ready');

    expect(readyResponse.status).toBe(200);
  });

  it('OpenAPI 文档与路由访问策略保持一致', async () => {
    const response = await request(app).get('/api-docs.json');

    expect(response.status).toBe(200);
    expect(response.body.paths['/auth/login'].post.security).toEqual([]);
    expect(response.body.paths['/auth/refresh'].post.security).toEqual([]);
    expect(response.body.paths['/user/info'].get.security).toEqual([{ bearerAuth: [] }]);
  });
});
