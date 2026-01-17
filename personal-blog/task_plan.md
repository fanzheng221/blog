# 个人博客项目优化计划

## 项目目标

1. **中文化项目**：将项目中所有英文内容更新为中文
2. **项目图标设计**：设计并集成一个好看的博客图标
3. **动态浏览器标题**：让浏览器 title 随页面变化
4. **AI 文章生成功能**：集成 AI 辅助文章创建

---

## 阶段 1：中文化项目

### 状态：complete

### 任务清单

- [x] 1.1 更新 index.html 中的元数据和标题
- [x] 1.2 更新所有页面组件中的英文文本
  - [x] Home.tsx - 首页
  - [x] Articles.tsx - 文章列表页
  - [x] Article.tsx - 文章详情页
  - [x] Login.tsx - 登录页
  - [x] Register.tsx - 注册页
  - [x] ArticleEditor.tsx - 文章编辑器
  - [x] ArticleManagement.tsx - 文章管理
  - [x] About.tsx - 关于页面
- [x] 1.3 更新组件中的英文文本
  - [x] Navbar.tsx - 导航栏
  - [x] AdminLayout.tsx - 管理后台布局
  - [x] Hero.tsx - 英雄区域
  - [x] ArticleCard.tsx - 文章卡片
  - [x] CategoryFilter.tsx - 分类筛选器
  - [x] CommentSection.tsx - 评论区域
- [x] 1.4 更新表单验证消息和提示文本

---

## 阶段 2：项目图标设计

### 状态：complete

### 任务清单

- [x] 2.1 设计 SVG 图标
  - 设计理念：现代、简约、科技感的抽象几何风格
  - 元素：六边形、圆形、渐变色
- [x] 2.2 创建多种尺寸
  - favicon.svg (32x32)
  - apple-touch-icon.svg (180x180)
  - icon.svg (512x512)
- [x] 2.3 集成到项目中
  - 更新 index.html 中的图标引用
  - 添加 manifest.json (PWA 支持)

---

## 阶段 3：动态浏览器标题

### 状态：complete

### 任务清单

- [x] 3.1 创建 useTitle hook
  - 支持动态更新标题
  - 支持标题模板（如 "页面标题 | 技术笔记"）
- [x] 3.2 在各页面应用动态标题
  - 首页：首页 | 技术笔记
  - 文章列表：文章 | 技术笔记
  - 文章详情：文章标题 | 技术笔记
  - 登录/注册：登录/注册 | 技术笔记
  - 管理后台：相关管理页面标题
- [x] 3.3 更新 index.html 默认标题

---

## 阶段 4：AI 文章生成功能

### 状态：complete

### 任务清单

- [x] 4.1 设计 AI 生成界面
  - 输入区域：主题/关键词
  - 选项：文章长度、风格
  - 生成按钮和进度显示
- [x] 4.2 选择 AI 服务
  - 使用智谱 AI (GLM-4-Flash)
- [x] 4.3 后端 API 集成
  - 创建 /api/ai/generate-article 端点
  - 添加 API key 配置
- [x] 4.4 前端实现
  - 创建 AIArticleGenerator 组件
  - 集成到 ArticleEditor 中
  - 支持编辑 AI 生成的内容
- [x] 4.5 安全和限制
  - 添加管理员权限验证
  - API key 存储在环境变量中

---

## 决策记录

| 决策点 | 选择 | 原因 |
|--------|------|------|
| AI 服务提供商 | 智谱 AI (GLM) | 国内服务，中文友好，有免费额度 |
| 博客名称 | 技术笔记 | 简洁明了，突出技术主题 |
| 图标风格 | 抽象几何 | 现代、科技感、适合技术博客 |

---

## 错误记录

| 错误 | 尝试 | 解决方案 |
|------|------|----------|
| - | - | - |

---

## 备注

- 所有中文文本需要保持专业、简洁
- 图标设计已考虑深色/浅色主题适配
- AI 功能使用智谱 AI，需要在 backend/.env 中配置 ZHIPUAI_API_KEY
- 图标文件位置：/public/icons/
- 使用智谱 AI 需要在 https://open.bigmodel.cn/ 注册获取 API Key
