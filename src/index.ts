// src/index.ts
import { appEnvConfig } from './env/index.js';
import { app } from './app.js';
import { Server } from 'http';
import { testDatabaseConnection } from '@/utils/db.js';
import logger from '@/utils/logger.js';
import { EnvEnums } from '@/enums/index.js';
import { connectRedis } from '@/utils/redis.js';
import { getLocalIP } from '@/utils/network.js';
import { SWAGGER_PATH } from '@/config/swagger.js';
import { appHandleServerEvents } from '@/config/HandleServerEvents.js';

const PORT = Number(process.env.PORT) || 3000;

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
    const server: Server = app.listen(appEnvConfig.port, () => {
      logger.info(`服务器正在运行...`);
      logger.info(`🚀 服务器启动成功`);
      logger.info(`📍 环境: ${appEnvConfig.env}`);
      if (appEnvConfig.env === EnvEnums.dev) {
        // 开发环境显示本机 IP，否则显示 localhost
        const host = appEnvConfig.env === EnvEnums.dev ? getLocalIP() : 'localhost';
        logger.info(`🔗 地址: http://${host}:${PORT}`);
      }

      if (appEnvConfig.env === EnvEnums.dev || appEnvConfig.env === EnvEnums.sit) {
        logger.info(`📚 API 文档: ${appEnvConfig.apiUrl + SWAGGER_PATH}`);
      }
    });

    appHandleServerEvents(server, PORT);
  } catch (error) {
    logger.error('应用启动失败:', error);
    process.exit(1);
  }
}

// 执行引导函数
bootstrap();
