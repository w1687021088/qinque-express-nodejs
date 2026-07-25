# Repository Guidelines

## 项目结构与模块组织

本项目是基于 Express 5 的 TypeScript API 服务。应用入口为 `src/index.ts`，Express 组合与全局中间件位于 `src/app.ts`。按职责组织代码：`src/modules/<feature>/` 放置功能模块的 `*.route.ts`、`*.controller.ts`、`*.service.ts`、`*.schema.ts` 与 `*.types.ts`；`src/routes/` 负责 `/api/v1` 下的公开和鉴权路由注册；`src/middlewares/`、`src/utils/`、`src/config/` 分别放共享中间件、基础设施工具和配置。数据库变更 SQL 放在 `src/sql/`，编译产物输出到 `dist/`，不得手动修改。

## 构建、检查与本地开发

- `npm ci`：按锁定版本安装依赖，适合干净环境和 CI。
- `npm run dev`：以 `NODE_ENV=dev` 监听并运行 `src/index.ts`。
- `npm run build`：使用 TypeScript 编译到 `dist/`。
- `npm start`：运行已构建的 `dist/index.js`。
- `npm run type-check`：仅执行严格类型检查。
- `npm run lint` / `npm run lint:fix`：检查或修复 ESLint 问题。
- `npm run format:check` / `npm run format`：检查或写入 Prettier 格式。

启动前在 `src/env/` 配置对应的 `.env.dev`、`.env.qa`、`.env.sit` 或 `.env.prod`，并提供 MySQL、Redis 与 `JWT_SECRET`。真实凭据不得提交。

## 编码风格与命名

使用 TypeScript 严格模式和 `@/` 指向 `src/` 的路径别名；NodeNext 导入须保留 `.js` 后缀。Prettier 规定两空格缩进、单引号、分号、120 字符行宽和无尾随逗号。文件以职责后缀命名，例如 `auth.service.ts`；类使用 PascalCase，函数、变量和路由字段使用 camelCase。新增输入参数应以 Zod schema 配合 `validateMiddleware` 验证，路由通过 `createAppRoutes` 声明。

## 测试指南

当前未配置测试框架或 `npm test` 脚本。提交前至少运行 `npm run type-check`、`npm run lint` 与 `npm run build`；新增测试时，将其置于对应模块附近，并在 `package.json` 中补充可重复执行的测试脚本。

## 提交与合并请求

提交历史采用 Conventional Commits，如 `feat(auth): 增加刷新 token 接口`、`fix(env): 修复配置`。使用 `feat`、`fix`、`refactor`、`style` 或 `chore`，scope 对应模块。PR 应说明变更和验证命令，关联相关 Issue；接口行为、响应或安全配置变更需附请求示例或截图，并避免混入无关格式化。
