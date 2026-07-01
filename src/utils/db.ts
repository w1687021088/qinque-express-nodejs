import mysql from 'mysql2/promise';
import { appEnvConfig } from '@/env/index.js';
import logger from '@/utils/logger.js';

const mysqlDB = appEnvConfig.mysqlDB;

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

// 🆕 新增：测试数据库连接的方法
export async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping(); // 发送一个简单的心跳查询
    connection.release();
    logger.info('✅ 数据库连接成功！');
  } catch (error) {
    logger.error('❌ 数据库连接失败:', error);
    // 这里可以选择退出进程，避免启动一个“残缺”的服务
    process.exit(1);
  }
}

export type DBExecuteRowData<T extends Record<string, any>> = Array<mysql.RowDataPacket & T>;

// // 用户表
// const tables = {
//   user: 'dake_users',
//   article: 'dake_articles'
// } as const;
//
// type TableKey = keyof typeof tables;
// export class DB {
//   select = (tableKey: TableKey, column: string[], where?: any[]) => {
//     let s = 'SELECT ';
//     for (let i = 0; i < column.length; i++) {
//       s += column[i];
//       if (i < column.length - 1) {
//         s += ', ';
//       }
//     }
//     const sql = s + ' FROM ' + tables[tableKey]; // + where 的逻辑
//
//     return sql;
//   };
// }
