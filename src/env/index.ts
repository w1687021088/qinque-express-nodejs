// src/env/index.ts
import dotenv from 'dotenv';
import path from 'node:path';
import { EnvEnums } from '@/enums/index.js';

// 获取当前环境（默认 dev）
const NODE_ENV = process.env.NODE_ENV || EnvEnums.dev;

const isDev = process.env.NODE_ENV === EnvEnums.dev;

// 环境文件映射
const envFiles: Record<string, string> = {
  dev: '.env.dev',
  qa: '.env.qa',
  sit: '.env.sit',
  prod: '.env.prod'
};

// 选择对应的环境文件
const envFile = envFiles[NODE_ENV];

if (!envFile) {
  throw new Error(`Unknown environment: ${NODE_ENV}`);
}

// 加载环境变量文件
const envPath = path.resolve(process.cwd(), './src/env', envFile);

dotenv.config({ path: envPath });

// 导出配置（带类型提示）
export const appEnvConfig = {
  // 环境信息
  env: process.env.NODE_ENV || EnvEnums.dev,

  appName: process.env.APP_NAME || 'MyApp',

  // 服务器配置
  port: parseInt(process.env.PORT || '3000', 10),
  apiUrl: process.env.API_URL || '',

  // redis
  redis: {
    host: process.env.REDIS_HOST || '',
    port: parseInt(process.env.REDIS_PORT || '3306', 10)
  },

  // 数据库配置
  mysqlDB: {
    host: process.env.DB_HOST || '',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    name: process.env.DB_NAME || ''
  },

  // 日志级别
  logLevel: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),

  // 辅助方法
  isDev: process.env.NODE_ENV === EnvEnums.dev,
  isQa: process.env.NODE_ENV === EnvEnums.qa,
  isSit: process.env.NODE_ENV === EnvEnums.sit,
  isProd: process.env.NODE_ENV === EnvEnums.prod
} as const;
