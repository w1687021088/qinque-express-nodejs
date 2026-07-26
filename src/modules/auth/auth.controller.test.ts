import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthController } from './auth.controller.js';
import { jwtConfig } from '@/config/jwtConfig.js';
import redisClient from '@/utils/redis.js';

const createResponse = () => {
  const response = {
    req: { context: undefined },
    status: vi.fn(),
    json: vi.fn()
  };
  response.status.mockReturnValue(response);
  return response;
};

describe('AuthController.logout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('将 access token 加入黑名单并删除同会话 refresh token', async () => {
    const controller = new AuthController();
    const response = createResponse();
    const setSpy = vi.spyOn(redisClient, 'set').mockResolvedValue('OK');
    const delSpy = vi.spyOn(redisClient, 'del').mockResolvedValue(1);
    const remainingSecondsSpy = vi.spyOn(jwtConfig, 'getAccessTokenRemainingSeconds').mockReturnValue(3600);

    await controller.logout(
      {
        headers: { authorization: 'Bearer access-token' },
        user: { userId: 'user-1', tokenId: 'session-1' }
      } as never,
      response as never
    );

    expect(remainingSecondsSpy).toHaveBeenCalledWith('access-token');
    expect(setSpy).toHaveBeenCalledWith('auth:access-token:blocklist:session-1', '1', { EX: 3600 });
    expect(delSpy).toHaveBeenCalledWith('auth:refresh-token:session-1');
    expect(response.status).toHaveBeenCalledWith(200);
  });
});
