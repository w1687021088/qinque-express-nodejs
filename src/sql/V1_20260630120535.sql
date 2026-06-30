-- /src/sql/V1_20260630120535.sql
-- V1_20260630120535 版本创建
-- 创建时间：2023-06-30 12:05:35
-- 创建人：dake_zjw
-- 描述：dake用户表
--
-- 执行命令（手动部署时）：
-- mysql -u用户名 -p密码 数据库名 < V1_20260630120535.sql

-- 1. 创建 dake_users 表
CREATE TABLE IF NOT EXISTS dake_users
(
    -- 1. 内部主键（自增，仅用于表关联，不对外暴露）
    id         BIGINT AUTO_INCREMENT NOT NULL COMMENT '内部主键',

    -- 2. 对外业务ID（雪花ID，用于接口返回和关联查询）
    user_id    VARCHAR(32)           NOT NULL COMMENT '业务用户ID（雪花ID）',

    -- 3. 业务字段
    username   VARCHAR(50)           NOT NULL COMMENT '用户名（登录用）',
    password   VARCHAR(255)          NOT NULL COMMENT '密码（bcrypt加密）',
    email      VARCHAR(100)          NULL     DEFAULT NULL COMMENT '邮箱',
    phone      VARCHAR(20)           NOT NULL COMMENT '手机号',
    nickname   VARCHAR(50)           NULL     DEFAULT NULL COMMENT '昵称',
    avatar     VARCHAR(500)          NULL     DEFAULT NULL COMMENT '头像URL',

    -- 4. 角色字段（位掩码，多选）
    role_mask  TINYINT UNSIGNED      NOT NULL DEFAULT 1 COMMENT '角色掩码：1达人，2机构，4选品团（组合相加，如3=达人+机构）',

    -- 5. 时间戳（标准双字段）
    created_at DATETIME                       DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    updated_at DATETIME                       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT '更新时间',

    -- 6. 约束与索引
    PRIMARY KEY (id) COMMENT '主键',
    UNIQUE KEY uk_user_id (user_id) COMMENT '业务ID唯一',
    UNIQUE KEY uk_username (username) COMMENT '用户名唯一',
    UNIQUE KEY uk_email (email) COMMENT '邮箱唯一',
    UNIQUE KEY uk_phone (phone) COMMENT '手机号唯一',
    INDEX idx_role_mask (role_mask) COMMENT '角色索引',
    INDEX idx_created_at (created_at) COMMENT '时间查询索引'

) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT = 'dake用户表（支持多角色位掩码）';

-- 2. 初始化角色数据（仅作注释说明，无需插入，因为角色已经通过位掩码定义）
-- 角色值说明：1=达人，2=机构，4=选品团

-- 3. 插入超级管理员（如需要）
-- INSERT INTO dake_users (user_id, username, password, phone, nickname, role_mask)
-- VALUES ('admin_snowflake_id', 'admin', 'hashed_password', '13800138000', '超级管理员', 7);

-- 4. 验证表结构
# SHOW CREATE TABLE dake_users;


-- ALTER TABLE dake_users MODIFY COLUMN email VARCHAR(100) NULL DEFAULT NULL COMMENT '邮箱';

-- ALTER TABLE dake_users MODIFY COLUMN phone VARCHAR(20) NULL DEFAULT NULL COMMENT '手机号';
-- dake用户信息表索引
-- ALTER TABLE dake_user_info ADD INDEX idx_user_id (user_id) COMMENT '用户ID索引';

-- 添加用户ID索引
-- ALTER TABLE dake_user_info ADD UNIQUE KEY uk_user_id (user_id) COMMENT '业务ID唯一';

-- 添加主键
-- ALTER TABLE dake_user_info ADD PRIMARY KEY (id) COMMENT '主键';

SELECT *
FROM dake_users
where role_mask = 1;





