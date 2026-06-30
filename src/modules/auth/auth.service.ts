import db, { DBExecuteRowData } from '@/utils/db.js';
import mysql from 'mysql2/promise';
import { AuthUserInfo } from '@/modules/auth/auth.types.js';

export class AuthService {
  /**
   * 查询用户是否存在
   * @param phone
   */
  queryUserExists = async (phone: string) => {
    const [rows] = await db.execute<DBExecuteRowData<{ phone: string }>>(
      'SELECT phone FROM node_data_01.dake_users WHERE phone=?',
      [phone]
    );
    return !!rows?.[0]?.phone;
  };
  /**
   * 创建用户
   * */
  createUser: (userId: string, phone: string, password: string) => Promise<AuthUserInfo> = async (
    userId,
    phone,
    password
  ) => {
    const username = `用户${phone}`;

    // 插入用户数据
    const [create_rows] = await db.execute(
      'INSERT INTO node_data_01.dake_users (user_id, username, password, phone) VALUES (?, ?, ?, ?)',
      [userId, username, password, phone]
    );
    // 获取插入的ID
    const insertId = (create_rows as mysql.ResultSetHeader).insertId;

    // 查询插入的用户数据
    const [rows] = await db.execute<DBExecuteRowData<{ created_at: Date }>>(
      'SELECT created_at FROM node_data_01.dake_users WHERE id=?',
      [insertId]
    );

    const data = rows?.[0];
    return {
      userId,
      phone,
      username,
      createdTime: data?.created_at
    };
  };
}
