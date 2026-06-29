// src/utils/logger.ts
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { appEnvConfig } from '@/env/index.js';

// 自定义格式
const myFormat = winston.format.printf(({ timestamp, level, message, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} [${level}]: ${message}${metaStr}`;
});

// 创建 logger
const logger = winston.createLogger({
  level: appEnvConfig.logLevel || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    // 开发环境用彩色易读格式，生产用 JSON
    appEnvConfig.isDev ? winston.format.combine(winston.format.colorize(), myFormat) : winston.format.json()
  ),
  transports: [
    // 控制台始终保留
    new winston.transports.Console()
  ],
  exitOnError: false
});

// 🔥 只在非开发环境（qa/sit/prod）启用文件日志
if (!appEnvConfig.isDev) {
  // 所有日志
  const allLogsTransport = new DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json())
  });

  // 错误日志（单独存储）
  const errorLogsTransport = new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d',
    level: 'error',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json())
  });

  logger.add(allLogsTransport);
  logger.add(errorLogsTransport);
}

export default logger;

export const createChildLogger = (moduleName: string) => logger.child({ module: moduleName });
