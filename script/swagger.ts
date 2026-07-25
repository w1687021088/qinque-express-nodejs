import swaggerAutogen from 'swagger-autogen';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const doc = {
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'API 文档'
  },
  host: 'localhost:3000',
  basePath: '/api/v1',
  schemes: ['http']
};

const outputFile = path.join(__dirname, '../swagger-output.json');
const endpointsFiles = [
  path.join(__dirname, '../src/modules/auth/auth.route.ts'),
  path.join(__dirname, '../src/modules/user/user.route.ts')
  // 添加其他模块
];

swaggerAutogen(outputFile, endpointsFiles, doc);
