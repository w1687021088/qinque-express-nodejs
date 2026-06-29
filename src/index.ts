import './env/index.js';
import { app } from './app.js';
import { Server } from 'http';
import { testDatabaseConnection } from '@/utils/db.js';

const PORT = Number(process.env.PORT) || 3000;

// 🔥 在启动服务器之前，先检查数据库是否活着
await testDatabaseConnection();

// 启动服务器
const server: Server = app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});

// 处理端口被占用的情况
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌端口${PORT}已被使用。尝试使用port =<number> npm run dev`);
    process.exit(1);
  }
  throw error;
});

/**
 * 当接收到终止信号时，优雅地关闭服务器。
 * @param {string} signal -接收到的终止信号
 */
function gracefulShutdown(signal: string): void {
  console.log(`\n${signal} 收到。优雅地关闭…`);
  server.close(() => {
    console.log('服务器关闭。');
    process.exit(0);
  });

  // 10秒后强制关闭
  setTimeout(() => {
    console.error('不能及时关闭连接，强行关闭');
    process.exit(1);
  }, 10000);
}

// 监听SIGINT和SIGTERM信号
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// 监听SIGTERM信号
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
