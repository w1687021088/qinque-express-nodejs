import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { EnvEnums } from '@/enums/index.js';

const envFiles: Record<EnvEnums, string> = {
  [EnvEnums.dev]: '.env.dev',
  [EnvEnums.qa]: '.env.qa',
  [EnvEnums.sit]: '.env.sit',
  [EnvEnums.prod]: '.env.prod'
};

const environmentAliases: Record<string, EnvEnums> = {
  dev: EnvEnums.dev,
  development: EnvEnums.dev,
  qa: EnvEnums.qa,
  sit: EnvEnums.sit,
  prod: EnvEnums.prod,
  production: EnvEnums.prod
};

const nodeEnv = environmentAliases[process.env.NODE_ENV || EnvEnums.dev];
const envFile = envFiles[nodeEnv];

if (!envFile) {
  throw new Error(`不支持的 NODE_ENV: ${process.env.NODE_ENV}`);
}

const envPath = path.resolve(process.cwd(), 'src/env', envFile);

if (!existsSync(envPath)) {
  throw new Error(`未找到环境配置文件 ${envPath}，请复制 src/env/.env.example 并填写 ${envFile}`);
}

dotenv.config({ path: envPath, quiet: true });

const booleanFromEnv = (defaultValue: boolean) =>
  z.preprocess(value => {
    if (value === undefined || value === '') return defaultValue;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return value;
  }, z.boolean());

const environmentSchema = z.object({
  NODE_ENV: z
    .preprocess(
      value => environmentAliases[String(value)] || value,
      z.enum([EnvEnums.dev, EnvEnums.qa, EnvEnums.sit, EnvEnums.prod])
    )
    .default(EnvEnums.dev),
  APP_NAME: z.string().min(1).default('MyApp'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  API_URL: z.url().optional().default(''),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
  SWAGGER_ENABLED: booleanFromEnv(nodeEnv === EnvEnums.dev || nodeEnv === EnvEnums.sit),
  CORS_ORIGINS: z.string().optional().default(''),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET 至少需要 32 个字符'),
  JWT_EXPIRES_IN: z
    .string()
    .regex(/^\d+[smhd]$/, 'JWT_EXPIRES_IN 格式应为数字加 s/m/h/d，例如 1h')
    .default('1h'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET 至少需要 32 个字符').optional(),
  JWT_REFRESH_EXPIRES_IN: z
    .string()
    .regex(/^\d+[smhd]$/, 'JWT_REFRESH_EXPIRES_IN 格式应为数字加 s/m/h/d，例如 30d')
    .default('30d'),
  SNOWFLAKE_EPOCH: z.string().datetime().default('2026-01-05T00:00:00.000Z'),
  REDIS_HOST: z.string().min(1).default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().int().min(1).max(65535).default(6379),
  DB_HOST: z.string().default(''),
  DB_PORT: z.coerce.number().int().min(1).max(65535).default(3306),
  DB_USER: z.string().default(''),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().default('')
});

const parsedEnv = environmentSchema.parse(process.env);
const isDev = parsedEnv.NODE_ENV === EnvEnums.dev;

const durationToSeconds = (value: string) => {
  const [, amount, unit] = /^(\d+)([smhd])$/.exec(value)!;
  const multipliers: Record<string, number> = { s: 1, m: 60, h: 60 * 60, d: 60 * 60 * 24 };
  return Number(amount) * multipliers[unit];
};

if (parsedEnv.NODE_ENV === EnvEnums.prod && !parsedEnv.CORS_ORIGINS) {
  throw new Error('生产环境必须配置 CORS_ORIGINS');
}

/**
 * 进程启动时唯一解析的类型化配置。
 * 除本文件外，业务与基础设施代码不得直接读取 process.env。
 */
export const appEnvConfig = {
  env: parsedEnv.NODE_ENV,
  appName: parsedEnv.APP_NAME,
  port: parsedEnv.PORT,
  apiUrl: parsedEnv.API_URL,
  logLevel: parsedEnv.LOG_LEVEL,
  swaggerEnabled: parsedEnv.SWAGGER_ENABLED,
  corsOrigins: parsedEnv.CORS_ORIGINS.split(',')
    .map(origin => origin.trim())
    .filter(Boolean),
  jwt: {
    secret: parsedEnv.JWT_SECRET,
    expiresIn: parsedEnv.JWT_EXPIRES_IN,
    // 兼容已有环境配置；新增或轮换配置时应使用独立的 JWT_REFRESH_SECRET。
    refreshSecret: parsedEnv.JWT_REFRESH_SECRET || parsedEnv.JWT_SECRET,
    refreshExpiresIn: parsedEnv.JWT_REFRESH_EXPIRES_IN,
    refreshExpiresInSeconds: durationToSeconds(parsedEnv.JWT_REFRESH_EXPIRES_IN),
    isUsingRefreshSecretFallback: !parsedEnv.JWT_REFRESH_SECRET
  },
  snowflakeEpoch: parsedEnv.SNOWFLAKE_EPOCH,
  redis: {
    host: parsedEnv.REDIS_HOST,
    port: parsedEnv.REDIS_PORT
  },
  mysqlDB: {
    host: parsedEnv.DB_HOST,
    port: parsedEnv.DB_PORT,
    user: parsedEnv.DB_USER,
    password: parsedEnv.DB_PASSWORD,
    database: parsedEnv.DB_NAME,
    name: parsedEnv.DB_NAME
  },
  isDev,
  isQa: parsedEnv.NODE_ENV === EnvEnums.qa,
  isSit: parsedEnv.NODE_ENV === EnvEnums.sit,
  isProd: parsedEnv.NODE_ENV === EnvEnums.prod
} as const;
