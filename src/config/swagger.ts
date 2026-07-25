import { z } from 'zod';
import swaggerUi from 'swagger-ui-express';
import { AppRoutes } from '@/routes/create-routes.js';
import express from 'express';

type SwaggerPath = {
  // 请求方法
  summary: string;
  requestBody?: RequestBody;
  parameters?: Parameters;
  responses?: Record<string, Responses>;
};

type Parameters = Array<{
  name: string;
  in: 'path' | 'query' | 'header';
  required?: boolean;
  schema: any;
  description?: string;
}>;

type RequestBody = {
  required?: boolean;
  content?: Record<string, { schema: ReturnType<typeof createBodySchema> }>;
};

type Responses = {
  description: string;
  content: Record<string, { schema: ReturnType<typeof createResultSchema> }>;
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
 * @param version
 * @param paths
 * @param tags
 * @returns
 */

const createSwaggerDocument = (
  version: string,
  paths?: SwaggerPaths,
  tags: Array<{ name: string; description: string }> = []
) => ({
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'API 文档（手动定义）'
  },
  servers: [{ url: `http://localhost:3000${version}` }],
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
 * @param dataSchema
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
 * @param app
 * @param version
 * @param all
 * @returns
 */
const createSwaggerConfig = (app: express.Express, version: string, all: AppRoutes) => {
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

      // 响应
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

  // console.log('📦 生成的 Swagger Paths:', JSON.stringify(swaggerDocument, null, 2));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  return app;
};

export const swaggerConfig = {
  zodToParams,
  createSwaggerDocument,
  createBodySchema,
  createResultSchema,
  createSwaggerConfig
};
