import dotenv from 'dotenv';
import path from 'node:path';

// 获取当前环境（默认 dev）
const NODE_ENV = process.env.NODE_ENV || 'dev';

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
  env: process.env.NODE_ENV || 'dev',
  appName: process.env.APP_NAME || 'MyApp',

  // 服务器配置
  port: parseInt(process.env.PORT || '3000', 10),
  apiUrl: process.env.API_URL || '',

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
  logLevel: process.env.LOG_LEVEL || 'info',
  // 辅助方法
  isDev: process.env.NODE_ENV === 'dev',
  isQa: process.env.NODE_ENV === 'qa',
  isSit: process.env.NODE_ENV === 'sit',
  isProd: process.env.NODE_ENV === 'prod'
};

// 打印当前配置（调试用，生产环境建议关闭）
if (appEnvConfig.isDev) {
  console.log('======================================= Environment Config =======================================');
  console.log(`Environment: ${appEnvConfig.env}`);
  console.log(`Port: ${appEnvConfig.port}`);
  console.log(`DB: ${appEnvConfig.mysqlDB.host}:${appEnvConfig.mysqlDB.port}/${appEnvConfig.mysqlDB.name}`);
  console.log('====================================================================================================');
}
