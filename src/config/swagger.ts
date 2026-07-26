import { z } from 'zod';
import swaggerUi from 'swagger-ui-express';
import { AppRoutes } from '@/routes/createRoutes.js';
import express from 'express';

/**
 * Swagger 配置
 * */
export const SWAGGER_PATH = '/api-docs';

/**
 * Swagger 服务器地址
 * */
export const SWAGGER_SERVER_URL = 'http://localhost:3000';

/**
 * Swagger 标题
 * */
export const SWAGGER_TITLE = 'API Docs';

/**
 * Swagger OpenAPI 规范版本
 * */

export const SWAGGER_OPEN_API_VERSION = '3.0.0';

/**
 * Swagger 描述
 * */
export const SWAGGER_DESCRIPTION = 'API Documentation';

type SwaggerPath = {
  /**
   * 请求方法
   * */
  summary: string;
  /**
   * 请求参数
   * */
  requestBody?: RequestBody;
  /**
   * 请求参数
   * */
  parameters?: Parameters;
  /**
   * 响应结果
   * */
  responses?: Record<string, Responses>;
};

type Parameters = Array<{
  /**
   * 参数名称
   * */
  name: string;
  /**
   * 参数位置
   * */
  in: 'path' | 'query' | 'header';
  /**
   * 是否必填
   * */
  required?: boolean;
  /**
   * 参数类型
   * */
  schema: any;
  /**
   * 参数描述
   * */
  description?: string;
}>;

type RequestBody = {
  /**
   * 是否必填
   * */
  required?: boolean;
  /**
   * 请求体内容
   * */
  content?: Record<string, { schema: ReturnType<typeof createBodySchema> }>;
};

type Responses = {
  /**
   * 响应状态码
   * */
  description: string;
  /**
   * 响应内容
   * */
  content: Record<string, { schema: ReturnType<typeof createResultSchema> }>;
};

type Tag = {
  name: string;
  description: string;
};

export type SwaggerPaths = {
  [path: string]: {
    [method: string]: SwaggerPath | string[];
  };
};

/**
 * 将 Zod Schema 转换为 Swagger 参数
 * @param schema
 * @param location
 * @returns
 */
const zodToParams = (schema: z.ZodObject<any>, location: 'path' | 'query' | 'header' = 'query'): any[] => {
  const shape = schema.shape || {};
  return Object.entries(shape).map(([name, zodSchema]) => {
    const isOptional = zodSchema instanceof z.ZodOptional;
    // 如果是可选类型，取内部的 schema
    const inner = isOptional ? (zodSchema as any)._def?.innerType || zodSchema : zodSchema;
    return {
      name,
      in: location,
      required: !isOptional,
      schema: z.toJSONSchema(inner), // 直接用 Zod 内置方法
      description: (zodSchema as any).description || ''
    };
  });
};

/**
 * 创建 Swagger 文档
 * @param version 版本
 * @param paths 路径
 * @param tags 标签 用于分组
 * @returns
 */
const createSwaggerDocument = (version: string, paths?: SwaggerPaths, tags: Array<Tag> = []) => ({
  openapi: SWAGGER_OPEN_API_VERSION,
  info: {
    title: SWAGGER_TITLE,
    version: '1.0.0',
    description: SWAGGER_DESCRIPTION
  },
  servers: [{ url: `${SWAGGER_SERVER_URL + version}` }],
  tags,
  paths: paths ?? {}
});

/**
 * 创建请求体 schema
 * @param bodySchema
 * @returns
 */
const createBodySchema = (bodySchema: z.ZodObject) => z.toJSONSchema(bodySchema);

/**
 * 创建结果 schema
 * @param dataSchema 数据 schema
 * @returns
 */
const createResultSchema = (dataSchema: z.ZodObject) =>
  z.toJSONSchema(
    z.object({
      code: z.number().describe('状态码'),
      message: z.string().describe('提示信息'),
      data: dataSchema,
      requestId: z.string().describe('请求ID'),
      timestamp: z.number().describe('时间戳')
    })
  );

/**
 * 创建 Swagger 配置
 * @param app 应用
 * @param version 版本
 * @param all 所有路由
 * @returns
 */
export const createSwaggerConfig = (app: express.Express, version: string, all: AppRoutes) => {
  const paths: SwaggerPaths = {};

  all.forEach(item => {
    const { path, config } = item;

    const docs = config.docs;
    docs.forEach(doc => {
      const apiPath = path + doc.path;

      if (!paths[apiPath]) {
        paths[apiPath] = {};
      }

      const pathNode = paths[apiPath] as any;

      // 构建参数
      const pathParameters = doc?.schemas?.params ? zodToParams(doc.schemas.params, 'path') : [];
      const queryParameters = doc?.schemas?.query ? zodToParams(doc.schemas.query, 'query') : [];
      const parameters = [...pathParameters, ...queryParameters];

      // 请求体
      const requestBody = doc?.schemas?.body
        ? {
            required: true,
            content: { 'application/json': { schema: createBodySchema(doc.schemas.body) } }
          }
        : undefined;

      // 响应，默认 200
      const responses = doc?.schemas?.result
        ? {
            '200': {
              description: doc?.schemas?.description || '请求成功',
              content: { 'application/json': { schema: createResultSchema(doc?.schemas?.result || z.object({})) } }
            }
          }
        : undefined;

      pathNode[doc.method] = {
        tags: [path.replace('/', '')], // ✅ 放在这里
        summary: doc?.schemas?.summary || '请求接口',
        requestBody,
        parameters,
        responses
      };
    });
  });

  const swaggerDocument = createSwaggerDocument(
    version,
    paths,
    all.map(item => ({ name: item.path.replace('/', ''), description: item.description || '' }))
  );

  app.use(SWAGGER_PATH, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  return app;
};
