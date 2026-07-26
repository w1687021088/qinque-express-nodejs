// src/utils/redis.ts
import redis from 'redis';
import logger from './logger.js';
import { appEnvConfig } from '@/env/index.js';

const redisClient = redis.createClient({
  url: `redis://${appEnvConfig.redis.host}:${appEnvConfig.redis.port}`
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

export const isRedisReady = () => redisClient.isReady;

export default redisClient;
