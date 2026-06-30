import db, { DBExecuteRowData } from '@/utils/db.js';

type UserInfo = {
  username: string;
  id: number;
  password: string;
};

export class UserService {
  // 模拟数据库查询
  async findById(name: string) {
    const [rows] = await db.execute<DBExecuteRowData<UserInfo>>(
      'SELECT * FROM node_data_01.dake_users WHERE name = ?',
      [name]
    );
    console.log(rows);
    // if (rows.length === 0) throw new Error('数据库查询失败');
    // 实际项目中这里会调用 Repository 或 ORM
    return rows?.[0];
  }

  async create(data: { name: string; age: number }) {
    // 模拟创建用户
    return {
      id: Date.now(),
      ...data
    };
  }
}
