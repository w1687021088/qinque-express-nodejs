// src/index.ts
import './env/index.js';
import { app } from './app.js';
import { Server } from 'http';
import { testDatabaseConnection } from '@/utils/db.js';
import logger from '@/utils/logger.js';
import { EnvEnums } from '@/enums/index.js';
import { connectRedis, disconnectRedis } from '@/utils/redis.js'; // 引入 disconnectRedis

const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * 启动服务器前的初始化
 */
async function bootstrap() {
  try {
    // 1. 测试数据库连接（失败则退出）
    logger.info('正在测试数据库连接...');
    await testDatabaseConnection();
    logger.info('数据库连接测试通过 ✅');

    // 2. 连接 Redis（失败则退出）
    logger.info('正在连接 Redis...');
    await connectRedis();
    logger.info('Redis 连接成功 ✅');

    // 3. 启动 HTTP 服务器
    const server: Server = app.listen(PORT, () => {
      logger.info(`服务器正在运行...`);
      logger.info(`🚀 服务器启动成功`);
      logger.info(`📍 环境: ${NODE_ENV}`);
      logger.info(`🔗 地址: http://localhost:${PORT}`);
      if (NODE_ENV === EnvEnums.dev) {
        logger.info(`📚 API 文档: http://localhost:${PORT}/api-docs`);
      }
    });

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
  } catch (error) {
    logger.error('应用启动失败:', error);
    process.exit(1);
  }
}

// 执行引导函数
bootstrap();
