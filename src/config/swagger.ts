import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { z } from 'zod';
import { appEnvConfig } from '@/env/index.js';
import { AppRoutes, RouteAccess, RouterDoc } from '@/routes/createRoutes.js';

/** Swagger 配置 */
export const SWAGGER_PATH = '/api-docs';
/** Swagger 服务器地址 */
export const SWAGGER_SERVER_URL = appEnvConfig.apiUrl || `http://localhost:${appEnvConfig.port}`;
/** Swagger 标题 */
export const SWAGGER_TITLE = 'API Docs';
/** Swagger OpenAPI 规范版本 */
export const SWAGGER_OPEN_API_VERSION = '3.0.0';
/** Swagger 描述 */
export const SWAGGER_DESCRIPTION = 'API Documentation';

/** Zod 转换后的标准 JSON Schema，交由 swagger-ui 原样消费。 */
type SwaggerSchema = unknown;

type SwaggerParameter = {
  name: string;
  in: 'path' | 'query' | 'header';
  required?: boolean;
  schema: SwaggerSchema;
  description?: string;
};

type SwaggerResponse = {
  description: string;
  content: Record<string, { schema: SwaggerSchema }>;
};

type SwaggerPath = {
  tags: string[];
  summary: string;
  requestBody?: {
    required: boolean;
    content: Record<string, { schema: SwaggerSchema }>;
  };
  parameters: SwaggerParameter[];
  responses: Record<string, SwaggerResponse>;
  security?: Array<Record<string, string[]>>;
};

export type SwaggerPaths = Record<string, Record<string, SwaggerPath>>;

/** 将 Zod 对象转换为 OpenAPI 参数。 */
const zodToParams = (schema: z.ZodObject, location: 'path' | 'query' | 'header' = 'query'): SwaggerParameter[] => {
  return Object.entries(schema.shape).map(([name, zodSchema]) => {
    const isOptional = zodSchema instanceof z.ZodOptional;
    const innerSchema = isOptional ? zodSchema.unwrap() : zodSchema;

    return {
      name,
      in: location,
      required: location === 'path' || !isOptional,
      schema: z.toJSONSchema(innerSchema),
      description: zodSchema.description || ''
    };
  });
};

const createResponseSchema = (dataSchema: z.ZodType) =>
  z.toJSONSchema(
    z.object({
      code: z.number().describe('状态码'),
      message: z.string().describe('提示信息'),
      data: dataSchema,
      requestId: z.string().describe('请求 ID'),
      timestamp: z.number().describe('时间戳')
    })
  );

const createErrorResponse = (description: string): SwaggerResponse => ({
  description,
  content: { 'application/json': { schema: createResponseSchema(z.null()) } }
});

const createResponses = (doc: RouterDoc, access: RouteAccess): Record<string, SwaggerResponse> => {
  const responses: Record<string, SwaggerResponse> = {
    '200': {
      description: doc.schemas?.description || '请求成功',
      content: {
        'application/json': { schema: createResponseSchema(doc.schemas?.result || z.unknown()) }
      }
    },
    '400': createErrorResponse('请求参数不合法'),
    '500': createErrorResponse('服务器内部错误')
  };

  if (access === 'authenticated') {
    responses['401'] = createErrorResponse('认证失败或登录状态已过期');
  }

  return responses;
};

const createSwaggerDocument = (
  version: string,
  paths: SwaggerPaths,
  tags: Array<{ name: string; description: string }>
) => ({
  openapi: SWAGGER_OPEN_API_VERSION,
  info: {
    title: SWAGGER_TITLE,
    version: '1.0.0',
    description: SWAGGER_DESCRIPTION
  },
  servers: [{ url: `${SWAGGER_SERVER_URL}${version}` }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  tags,
  paths
});

/** 根据路由元数据生成并挂载 Swagger 文档。 */
export const createSwaggerConfig = (app: express.Express, version: string, all: AppRoutes) => {
  const paths: SwaggerPaths = {};

  all.forEach(({ path, config }) => {
    config.docs.forEach(doc => {
      const apiPath = `${path}${doc.path}`;
      const access = doc.access ?? 'authenticated';
      const pathNode = paths[apiPath] || (paths[apiPath] = {});
      const pathParameters = doc.schemas?.params ? zodToParams(doc.schemas.params, 'path') : [];
      const queryParameters = doc.schemas?.query ? zodToParams(doc.schemas.query, 'query') : [];

      pathNode[doc.method] = {
        tags: [path.replace('/', '')],
        summary: doc.schemas?.summary || '请求接口',
        requestBody: doc.schemas?.body
          ? {
              required: true,
              content: { 'application/json': { schema: z.toJSONSchema(doc.schemas.body) } }
            }
          : undefined,
        parameters: [...pathParameters, ...queryParameters],
        responses: createResponses(doc, access),
        security: access === 'authenticated' ? [{ bearerAuth: [] }] : []
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
