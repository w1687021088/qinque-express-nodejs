import { Server } from 'http';
import logger from '@/utils/logger.js';
import { disconnectRedis } from '@/utils/redis.js';

// 服务器事件处理
export function appHandleServerEvents(server: Server, PORT: number) {
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
    logger.info(`\n收到 ${signal} 信号，开始优雅关闭...`);

    // 关闭 HTTP 服务器（等待所有连接结束）
    server.close(() => {
      logger.info('HTTP 服务器已关闭');
    });

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
