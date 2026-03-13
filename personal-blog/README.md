# 个人博客系统前端 (Personal Blog Frontend)

这是一个基于 React 19、TypeScript 和 Vite 构建的个人博客系统前端项目。

## 技术栈

* **核心框架**: React 19.2 + TypeScript 5.9
* **构建工具**: Vite 7.2
* **路由管理**: React Router DOM 7
* **样式处理**: TailwindCSS 3.4
* **UI 组件库**: Radix UI Primitives + Lucide React 图标
* **表单处理**: React Hook Form + Zod
* **网络请求**: Axios
* **Markdown 渲染**: React-Markdown + Remark-Gfm

## 主要功能

* **前台展示**:
  * 首页展示精选和最新文章
  * 文章列表与分类过滤
  * 文章详情展示（支持 Markdown 渲染及阅读量统计）
  * 响应式设计，适配移动端和桌面端
* **后台管理**:
  * **文章管理**: 支持文章的创建、编辑、删除、状态切换等
  * **分类管理**: 管理博客文章的分类
  * **富文本支持**: 提供支持 Markdown 和图片封面的文章编辑器
* **系统体验**: 支持系统默认及手动切换亮色/深色主题，使用 Toast 组件进行消息反馈

## 项目运行

请确保您的环境中已安装 Node.js (建议 v18+) 和 [pnpm](https://pnpm.io/)。

### 安装依赖

```bash
pnpm install
```

### 开发环境运行

```bash
pnpm dev
```
开发服务器将默认在 `http://localhost:5173` 启动。

### 生产环境构建

```bash
pnpm build
```

### 代码规范与格式化

```bash
# 运行 ESLint 检查
pnpm lint

# 修复 ESLint 报错
pnpm lint:fix

# 运行 Prettier 格式化检查
pnpm format:check

# 自动格式化代码
pnpm format

# 一键修复及格式化
pnpm fix
```

## 目录结构说明

```
src/
├── components/
│   ├── features/       # 包含业务逻辑的组件库 (如 ArticleCard, ThemeToggle 等)
│   ├── layout/         # 页面布局结构组件 (Header, Footer, AdminLayout 等)
│   ├── providers/      # Context 状态提供者
│   ├── routes/         # 路由保护及高阶路由控制
│   └── ui/             # 基础的可复用 UI 视图组件库
├── contexts/           # 全局 Context (Auth 等)
├── hooks/              # 自定义 Hooks
├── lib/
│   ├── api/            # 服务端 API 请求层封装与类型定义
│   └── utils.ts        # 全局工具函数
├── pages/              # 页面级组件与视图
└── types/              # TypeScript 公共类型定义
```

## 环境变量配置

请在项目根目录复制 `.env.example` 为 `.env` (如果存在)，或直接创建 `.env.local` 文件，配置服务端 API 地址：

```env
VITE_API_URL=http://localhost:3001/api
```
注：在部署到生产环境（如 Zeabur 等）时，需要配置生产环境对应的 `VITE_API_URL` 变量。
