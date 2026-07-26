import { Server } from 'http';
import logger from '@/utils/logger.js';
import { disconnectRedis } from '@/utils/redis.js';
import { setApplicationReady } from '@/utils/readiness.js';

// 服务器事件处理
export function appHandleServerEvents(server: Server, PORT: number) {
  let isShuttingDown = false;

  // 4. 端口冲突处理
  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      logger.error(`❌ 端口 ${PORT} 已被占用，请使用其他端口`);
      process.exit(1);
    } else {
      logger.error('服务器启动失败:', error);
      process.exit(1);
    }
  });

  // 5. 优雅关闭（改为 async）
  const gracefulShutdown = async (signal: string) => {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;
    logger.info(`\n收到 ${signal} 信号，开始优雅关闭...`);
    setApplicationReady(false);

    // 停止接收新连接，并等待现有 HTTP 请求完成。
    await new Promise<void>((resolve, reject) => {
      server.close(error => (error ? reject(error) : resolve()));
    });
    logger.info('HTTP 服务器已关闭');

    // 关闭 Redis 连接
    await disconnectRedis();

    // 退出进程
    logger.info('进程退出');
    process.exit(0);
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  // 6. 进程级异常捕获（兜底）
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('未处理的 Promise 拒绝:', { reason, promise });
  });

  process.on('uncaughtException', error => {
    logger.error('未捕获的异常:', error);
    process.exit(1);
  });
}
