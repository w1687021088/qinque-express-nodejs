// src/modules/auth/auth.service.ts
import db, { DBExecuteRowData } from '@/utils/db.js';
import mysql from 'mysql2/promise';
import { AuthUserInfo, AuthUserWithPassword } from '@/modules/auth/auth.types.js';

export class AuthService {
  /**
   * 查询用户信息
   * @param phone
   */
  queryUserInfo = async (phone: string) => {
    const sql =
      'SELECT user_id AS userId, username, phone, password, created_at AS createdAt FROM node_data_01.dake_users WHERE phone=? LIMIT 1';

    // 查询用户信息
    const [rows] = await db.execute<DBExecuteRowData<AuthUserWithPassword>>(sql, [phone]);
    // 获取用户信息
    const data = rows?.[0];

    if (!data) {
      return null;
    }

    return {
      userId: data?.userId,
      phone: data?.phone,
      username: data?.username,
      createdTime: data?.createdAt,
      password: data?.password
    };
  };
  /**
   * 查询用户是否存在
   * @param phone
   */
  queryUserExists = async (phone: string) => {
    const sql = 'SELECT phone FROM node_data_01.dake_users WHERE phone=? LIMIT 1';

    const [rows] = await db.execute<DBExecuteRowData<{ phone: string }>>(sql, [phone]);
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
    const sql = 'INSERT INTO node_data_01.dake_users (user_id, username, password, phone) VALUES (?, ?, ?, ?)';

    // 设置用户名(默认)
    const username = `用户${phone}`;

    // 插入用户数据
    const [create_rows] = await db.execute(sql, [userId, username, password, phone]);

    // 获取插入的ID
    const insertId = (create_rows as mysql.ResultSetHeader).insertId;

    // 查询插入的用户数据
    const [rows] = await db.execute<DBExecuteRowData<{ created_at: Date }>>(
      'SELECT created_at AS createdAt FROM node_data_01.dake_users WHERE id=?',
      [insertId]
    );

    const data = rows?.[0];

    return {
      userId,
      phone,
      username,
      createdAt: data?.createdAt
    };
  };
}
