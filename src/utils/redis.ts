// src/utils/redis.ts
import redis from 'redis';
import logger from './logger.js';

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
});

redisClient.on('error', err => {
  logger.error('Redis 连接错误:', err);
});

redisClient.on('connect', () => {
  logger.info('✅ Redis 连接成功！');
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient;
};

export default redisClient;
