import mysql from 'mysql2/promise';
import { appEnvConfig } from '@/env/index.js';
import logger from '@/utils/logger.js';

// 从环境变量中获取数据库配置
const mysqlDB = appEnvConfig.mysqlDB;

// 创建数据库连接池
const pool = mysql.createPool({
  host: mysqlDB.host,
  user: mysqlDB.user,
  port: mysqlDB.port,
  password: mysqlDB.password,
  database: mysqlDB.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;

// 试数据库连接的方法
export async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping(); // 发送一个简单的心跳查询
    connection.release();
    logger.info('✅ 数据库连接成功！');
  } catch (error) {
    logger.error('❌ 数据库连接失败:', error);
    // 由启动入口统一记录失败并决定进程退出，避免基础设施工具中断调用栈。
    throw error;
  }
}

export type DBExecuteRowData<T extends Record<string, any>> = Array<mysql.RowDataPacket & T>;
