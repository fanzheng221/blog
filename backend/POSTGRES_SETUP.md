# PostgreSQL 设置指南

## 1. 安装 PostgreSQL

### macOS
```bash
# 使用 Homebrew
brew install postgresql@16
brew services start postgresql@16

# 或者下载 Postgres.app
# https://postgresapp.com/
```

### Windows
下载并安装: https://www.postgresql.org/download/windows/

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## 2. 创建数据库

```bash
# 连接到 PostgreSQL
psql postgres

# 创建数据库
CREATE DATABASE personal_blog;

# 创建用户 (可选，如果不想使用默认的postgres用户)
CREATE USER blog_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE personal_blog TO blog_user;

# 退出
\q
```

## 3. 环境变量配置

确保 `.env` 文件配置正确：

```env
# PostgreSQL Database
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=personal_blog
PG_USER=postgres        # 或者 blog_user
PG_PASSWORD=postgres    # 或者你设置的密码
```

## 4. 测试连接

运行开发服务器：

```bash
cd backend
pnpm run dev
```

如果连接成功，你会看到：
```
PostgreSQL connected successfully
Database tables created successfully
Database seeded with initial data
Admin user created:
  Email: admin@blog.com
  Password: admin123
Server running on port 3001
```

## 5. 数据库迁移脚本 (可选)

如果需要手动运行 SQL：

```sql
-- 文件路径: backend/src/utils/migrate.ts

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 文章表
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 文章标签表
CREATE TABLE IF NOT EXISTS article_tags (
  article_id TEXT REFERENCES articles(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  PRIMARY KEY (article_id, tag)
);

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id TEXT REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON comments(author_id);
```

## 6. 常用命令

```bash
# 连接到数据库
psql -U postgres -d personal_blog

# 查看表
\dt

# 查看用户
SELECT * FROM users;

# 删除数据库
DROP DATABASE personal_blog;

# 重新开始
DROP DATABASE personal_blog;
CREATE DATABASE personal_blog;
```
