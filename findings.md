# Findings: 个人博客网站项目扩展

## 需求分析

### 当前问题
1. **数据源问题**: 所有数据都是 mock 产生的，不适用于实际项目
2. **权限问题**: 评论功能没有角色权限控制
3. **管理功能缺失**: 没有文章编辑页面，admin 无法管理内容

### 需要实现的功能

#### 后端 API
- RESTful API 设计
- 数据库持久化 (SQLite)
- JWT 认证系统
- 角色权限控制 (Admin/User)
- 文章 CRUD API
- 评论 CRUD API (需认证)

#### 前端功能
- 用户认证 (登录/注册)
- 角色权限控制
- 文章编辑器 (仅 Admin)
- 评论权限控制 (登录后可评论)

---

## 技术选型

### 后端技术栈

#### 框架选择: Express.js
**理由**:
- 轻量级、灵活性高
- 中间件生态丰富
- TypeScript 支持完善
- 社区成熟

#### 数据库选择: SQLite
**理由**:
- 无需额外服务，单文件存储
- 适合演示和小型项目
- better-sqlite3 性能优秀
- 易于迁移和备份

#### 认证方案: JWT
**理由**:
- 无状态，易于扩展
- 前后端分离友好
- 行业标准
- 不依赖 session

#### 密码加密: bcryptjs
**理由**:
- 安全的哈希算法
- 自动加盐
- 行业标准

---

## API 设计

### 认证相关

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| POST | /api/auth/register | 用户注册 | 公开 |
| POST | /api/auth/login | 用户登录 | 公开 |
| GET | /api/auth/me | 获取当前用户 | 需认证 |

### 文章相关

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | /api/articles | 获取文章列表 | 公开 |
| GET | /api/articles/:slug | 获取文章详情 | 公开 |
| POST | /api/articles | 创建文章 | Admin |
| PUT | /api/articles/:id | 更新文章 | Admin |
| DELETE | /api/articles/:id | 删除文章 | Admin |

### 评论相关

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | /api/articles/:slug/comments | 获取评论列表 | 公开 |
| POST | /api/articles/:slug/comments | 创建评论 | 需认证 |
| DELETE | /api/comments/:id | 删除评论 | 作者或Admin |

### 分类相关

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | /api/categories | 获取分类列表 | 公开 |

---

## 数据库设计

### users 表
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user', -- 'user' or 'admin'
  avatar TEXT,
  bio TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### categories 表
```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### articles 表
```sql
CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category_id TEXT,
  author_id TEXT NOT NULL,
  featured INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (author_id) REFERENCES users(id)
);
```

### article_tags 表 (文章标签关联)
```sql
CREATE TABLE article_tags (
  article_id TEXT,
  tag TEXT NOT NULL,
  PRIMARY KEY (article_id, tag),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);
```

### comments 表
```sql
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id TEXT, -- 支持嵌套评论
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id),
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);
```

---

## 安全考虑

### 密码安全
- 使用 bcryptjs 加密，salt rounds = 10
- 永不存储明文密码
- 密码强度验证 (最少 8 位)

### JWT 安全
- 使用环境变量存储 secret
- 设置合理的过期时间 (7 天)
- HTTPS 传输 (生产环境)

### API 安全
- CORS 配置
- 请求频率限制 (可选)
- SQL 注入防护 (参数化查询)
- XSS 防护 (前端转义)

---

## 前端状态管理

### AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
```

### API Client
```typescript
// 请求拦截器 - 添加 JWT
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 处理 401
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 跳转到登录页
    }
    return Promise.reject(error);
  }
);
```

---

## 更新日志

### 2025-01-13 - 初始阶段
- 创建 findings.md
- 确定技术栈和项目结构

### 2025-01-13 - 扩展规划
- 添加后端 API 设计
- 添加认证系统规划
- 添加数据库设计
- 添加权限控制规划

### 2025-01-13 - 后端实现遇到的问题
**问题**: better-sqlite3 原生模块构建失败
**错误**: Could not locate the bindings file for better_sqlite3.node
**原因**: better-sqlite3 需要编译原生 C++ 模块，在某些环境下可能失败
**可能的解决方案**:
1. 使用 Docker 容器运行后端
2. 切换到 sql.js (纯 JavaScript SQLite)
3. 使用现成的云数据库服务 (如 Supabase, Firebase)
4. 使用其他无需编译的数据库 (如 LowDB, NeDB)
