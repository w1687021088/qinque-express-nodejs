// src/index.ts
import './env/index.js';
import { app } from './app.js';
import { Server } from 'http';
import { testDatabaseConnection } from '@/utils/db.js';
import logger from '@/utils/logger.js';
import { EnvEnums } from '@/enums/index.js';
import { connectRedis } from '@/utils/redis.js';

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

    // 5. 优雅关闭
    const gracefulShutdown = (signal: string) => {
      logger.info(`\n收到 ${signal} 信号，开始优雅关闭...`);
      server.close(() => {
        logger.info('服务器已关闭，进程退出');
        process.exit(0);
      });

      // 强制关闭超时保护（10 秒）
      setTimeout(() => {
        logger.error('强制关闭服务器（超时）');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    // 6. 进程级异常捕获（兜底）
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('未处理的 Promise 拒绝:', { reason, promise });
      // 生产环境可以优雅退出，但建议重启进程
      // 这里只记录，不退出（可能某些拒绝是可恢复的）
    });

    process.on('uncaughtException', error => {
      logger.error('未捕获的异常:', error);
      // 对于未捕获的异常，建议退出进程（可能导致资源泄漏）
      process.exit(1);
    });
  } catch (error) {
    // 如果初始化（如数据库或 Redis 连接）失败，记录并退出
    logger.error('应用启动失败:', error);
    process.exit(1);
  }
}

// 执行引导函数
bootstrap();
