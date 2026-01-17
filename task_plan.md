# Task Plan: 个人博客网站项目 - 完整版

## 目标
创建一个功能完整的个人博客网站，包含前端、后端 API、用户认证、角色权限系统和文章管理功能。

## 技术栈

### 前端
- **框架**: React + TypeScript
- **UI 组件库**: shadcn/ui
- **样式**: Tailwind CSS
- **构建工具**: Vite
- **路由**: React Router v6
- **状态管理**: React Context + hooks

### 后端
- **框架**: Node.js + Express + TypeScript
- **数据库**: SQLite (better-sqlite3)
- **认证**: JWT (jsonwebtoken)
- **密码加密**: bcryptjs

---

## 阶段规划

### 阶段 1-5: 前端基础 ✅
**状态**: complete

已完成前端 UI、布局、组件和页面开发。

---

### 阶段 6: 后端 API 开发 ⏳
**状态**: in_progress

#### 6.1 项目初始化
- [ ] 创建后端项目结构
- [ ] 配置 TypeScript 和 Express
- [ ] 设置数据库 (SQLite)
- [ ] 配置环境变量

#### 6.2 数据模型设计
- [ ] User 模型 (用户表)
- [ ] Article 模型 (文章表)
- [ ] Category 模型 (分类表)
- [ ] Comment 模型 (评论表)
- [ ] 数据库初始化脚本

#### 6.3 认证系统
- [ ] JWT 中间件
- [ ] 注册 API
- [ ] 登录 API
- [ ] 获取当前用户信息 API
- [ ] 密码加密

#### 6.4 文章 API
- [ ] GET /api/articles - 获取文章列表
- [ ] GET /api/articles/:slug - 获取文章详情
- [ ] POST /api/articles - 创建文章 (Admin)
- [ ] PUT /api/articles/:id - 更新文章 (Admin)
- [ ] DELETE /api/articles/:id - 删除文章 (Admin)
- [ ] GET /api/categories - 获取分类列表

#### 6.5 评论 API
- [ ] GET /api/articles/:slug/comments - 获取评论
- [ ] POST /api/articles/:slug/comments - 创建评论 (需登录)
- [ ] DELETE /api/comments/:id - 删除评论 (作者或Admin)

**输出**:
- [backend/](backend/) - 完整的后端 API
- RESTful API 接口
- JWT 认证系统

---

### 阶段 7: 前端集成与 API 对接
**状态**: pending

#### 7.1 API 客户端
- [ ] 创建 axios/fetch 配置
- [ ] 请求拦截器 (添加 JWT)
- [ ] 响应拦截器 (错误处理)
- [ ] API 类型定义

#### 7.2 状态管理
- [ ] AuthContext - 认证状态
- [ ] UserContext - 用户信息
- [ ] 自定义 hooks (useAuth, useUser)

#### 7.3 替换 Mock 数据
- [ ] 更新首页使用真实 API
- [ ] 更新文章列表使用真实 API
- [ ] 更新文章详情使用真实 API
- [ ] 添加加载状态
- [ ] 添加错误处理

**输出**:
- API 集成完成
- 所有 Mock 数据替换为真实 API 调用

---

### 阶段 8: 认证页面开发
**状态**: pending

#### 8.1 登录页面
- [ ] 创建 Login 页面
- [ ] 登录表单 (邮箱 + 密码)
- [ ] 表单验证
- [ ] 错误提示
- [ ] 记住我功能

#### 8.2 注册页面
- [ ] 创建 Register 页面
- [ ] 注册表单 (用户名 + 邮箱 + 密码)
- [ ] 表单验证
- [ ] 密码强度提示
- [ ] 注册成功提示

#### 8.3 路由保护
- [ ] PrivateRoute 组件
- [ ] AdminRoute 组件
- [ ] 未登录重定向到登录页
- [ ] 权限不足提示

**输出**:
- 完整的认证流程
- 路由保护机制

---

### 阶段 9: 文章管理 (Admin)
**状态**: pending

#### 9.1 文章编辑器页面
- [ ] 创建 ArticleEditor 页面
- [ ] Markdown 编辑器
- [ ] 实时预览
- [ ] 分类选择
- [ ] 封面图片上传
- [ ] 标签输入

#### 9.2 文章管理页面
- [ ] 创建 ArticleManagement 页面
- [ ] 文章列表 (表格视图)
- [ ] 搜索和筛选
- [ ] 批量操作
- [ ] 删除确认

#### 9.3 权限控制
- [ ] 仅 Admin 可访问编辑器
- [ ] 仅 Admin 可访问管理页面
- [ ] Navbar 显示管理入口 (仅 Admin)

**输出**:
- 完整的文章管理系统
- 权限控制实现

---

### 阶段 10: 评论系统优化
**状态**: pending

#### 10.1 评论权限
- [ ] 未登录显示"登录后评论"提示
- [ ] 登录后显示评论表单
- [ ] 评论表单验证

#### 10.2 评论功能增强
- [ ] 编辑自己的评论
- [ ] 删除自己的评论
- [ ] 回复评论
- [ ] 点赞功能

#### 10.3 评论通知
- [ ] 评论成功提示
- [ ] 错误提示

**输出**:
- 完整的评论权限系统
- 评论 CRUD 功能

---

## 错误记录

| 错误 | 尝试 | 解决方案 | 状态 |
|------|------|----------|------|
| Parcel 打包失败 | 1 | 使用 Vite 开发服务器代替打包 | ✅ |
| better-sqlite3 原生模块构建失败 | 1-2 | 切换到 sql.js，仍然有问题 | ⏸️ |
| 数据库选择 | 1-3 | 用户决定使用 PostgreSQL | ✅ |
| bcrypt.hash is not a function | 1 | 使用 bcrypt.default.hash() | ✅ |
| 缺少 @radix-ui/react-alert-dialog | 1 | 安装依赖 | ✅ |

---

## 待解决问题

### 当前任务: Admin 页面导航和 API 集成完成
**状态**: 完成 ✅

- [x] 创建 AdminLayout 组件（带完整导航条）
- [x] 更新 ArticleManagement 使用 AdminLayout
- [x] 更新 ArticleEditor 使用 AdminLayout
- [x] 更新 Home 页面使用后端 API
- [x] 更新 Articles 页面使用后端 API
- [x] 更新 Article 详情页面使用后端 API
- [x] 更新 CategoryFilter 使用后端 API
- [x] 更新 CommentSection 使用后端 API 和认证权限

### 阶段 6: 后端 API 开发
**状态**: complete ✅

### 阶段 7: 前端集成与 API 对接
**状态**: complete ✅

### 阶段 8: 认证页面开发
**状态**: complete ✅

### 阶段 9: 文章管理 (Admin)
**状态**: complete ✅

### 阶段 10: 评论系统优化
**状态**: complete ✅

- [x] 评论权限控制（登录后才能评论）
- [x] 删除自己的评论或管理员删除
- [x] 使用后端 API

---

## 决策记录

| 决策 | 原因 | 日期 |
|------|------|------|
| Editorial Magazine 风格 | 提供独特、专业的视觉体验 | 2025-01-13 |
| Stone + Red 配色方案 | 温暖、现代，适合阅读 | 2025-01-13 |
| PostgreSQL 数据库 | 生产级、功能强大、用户要求 | 2025-01-13 |
| shadcn/ui | 可定制、可访问性好、与 Tailwind 集成 | 2025-01-13 |
| SQLite 数据库 | 轻量级、无需额外服务、适合演示 | 2025-01-13 |
| JWT 认证 | 无状态、易于扩展、行业标准 | 2025-01-13 |
| bcryptjs 密码加密 | 安全、行业标准算法 | 2025-01-13 |
