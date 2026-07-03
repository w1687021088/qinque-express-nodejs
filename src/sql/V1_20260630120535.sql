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
    status     TINYINT UNSIGNED      NOT NULL DEFAULT 1 COMMENT '状态：1正常，0禁用',
    deleted_at DATETIME                       DEFAULT NULL COMMENT '删除时间',

    -- 4. 角色字段（位掩码，多选）
    role_mask  TINYINT UNSIGNED      NOT NULL DEFAULT 1 COMMENT '角色掩码：1达人，2机构，4选品团（组合相加，如3=达人+机构）',

    -- 5. 时间戳（标准双字段）
    created_at DATETIME                       DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    updated_at DATETIME                       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT '更新时间',

    -- 6. 约束与索引
    PRIMARY KEY (id) COMMENT '主键',
    UNIQUE INDEX uk_user_id (user_id) COMMENT '业务ID唯一',
    UNIQUE INDEX uk_username (username) COMMENT '用户名唯一',
    UNIQUE INDEX uk_email (email) COMMENT '邮箱唯一',
    UNIQUE INDEX uk_phone_deleted_at (phone, deleted_at) COMMENT '手机号唯一: 通过手机号查询记得带上 deleted_at IS NULL',
    INDEX idx_role_mask (role_mask) COMMENT '角色索引',
    INDEX idx_created_at (created_at) COMMENT '时间查询索引'

) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT = 'dake用户表（支持多角色位掩码）';

