// eslint.config.js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 1. 忽略文件配置
  {
    ignores: ['dist/**', 'node_modules/**', '**/*.js']
  },
  // 2. 基础推荐规则
  eslint.configs.recommended,
  // 3. TypeScript 推荐规则
  ...tseslint.configs.recommended,
  // 4. 自定义规则
  {
    rules: {
      // 关闭与 Prettier 冲突的规则（可选）
      semi: 'off',
      '@typescript-eslint/no-explicit-any': 'off' // 将 'any' 类型设为警告
      // 在这里添加或覆盖其他规则
    }
  }
);
