import db, { DBExecuteRowData } from '@/utils/db.js';

type UserInfo = {
  username: string;
  id: number;
  password: string;
};

export class UserService {
  // 模拟数据库查询
  async findById(name: string) {
    const [rows] = await db.execute<DBExecuteRowData<UserInfo>>('SELECT * FROM user WHERE name = ?', [name]);
    console.log(rows);
    if (rows.length === 0) throw new Error('Database query failed');
    // 实际项目中这里会调用 Repository 或 ORM
    return {
      name: 'zjw',
      age: 18,
      email: 'zjw@example.com'
    };
  }

  async create(data: { name: string; age: number }) {
    // 模拟创建用户
    return {
      id: Date.now(),
      ...data
    };
  }
}
