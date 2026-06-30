// src/utils/redis.ts
import redis from 'redis';
import logger from './logger.js';

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
});

// 监听错误事件
redisClient.on('error', err => {
  logger.error('Redis 连接错误:', err);
});

// 监听连接事件
redisClient.on('connect', () => {
  logger.info('✅ Redis 连接成功！');
});

// 导出连接函数
export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient;
};

// 导出断开函数
export const disconnectRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
    logger.info('Redis 连接已关闭');
  }
};

export default redisClient;
