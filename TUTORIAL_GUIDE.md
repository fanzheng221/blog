# 📚 入门教程系列使用指南

## 📖 系列概览

本教程系列包含三个大主题，共 22 篇文章，帮助新手从零开始学习 JavaScript、TypeScript 和 React。

### JavaScript 基础篇（8篇）
适合零基础学员，从最基本的概念开始，逐步深入到异步编程和 DOM 操作。

### TypeScript 进阶篇（6篇）
适合有一定 JavaScript 基础的学员，学习如何使用类型系统提升代码质量。

### React 实战篇（8篇）
适合有 JavaScript/TypeScript 基础的学员，学习现代前端框架的使用。

---

## 🚀 快速开始

### 方法一：使用预设提示词

1. 打开博客系统的文章编辑器
2. 点击"AI 生成文章"按钮
3. 在主题输入框中输入对应文章的完整提示词（见下方）
4. 选择写作风格和技术深度
5. 点击生成

### 方法二：使用 JSON 配置

如果你想自定义提示词，可以编辑 `tutorial-prompts.json` 文件：

```json
{
  "topic": "在这里输入你的主题描述",
  "style": "friendly | technical | practical",
  "length": "short | medium | long",
  "keywords": ["关键词1", "关键词2", "关键词3"]
}
```

---

## 📝 完整提示词列表

### JavaScript 基础篇

#### 1. JavaScript 简介：从零开始
```
为完全零基础的初学者介绍 JavaScript，包括 JavaScript 是什么、它的历史和应用场景、如何搭建开发环境（使用 VS Code 和浏览器控制台）、编写第一个 Hello World 程序，以及变量的基本概念和声明方式（let、const 的区别和使用场景）。
```
- **风格**：friendly（友好）
- **长度**：medium（中等）
- **关键词**：JavaScript, 入门, 环境搭建, 变量, let, const

#### 2. JavaScript 数据类型详解
```
深入讲解 JavaScript 的数据类型系统，包括基本类型（字符串、数字、布尔、null、undefined、symbol）和引用类型（数组、对象）的特点和使用场景，如何进行类型检查和类型转换，并通过构建一个简单的学生信息管理系统来实践这些概念。
```
- **风格**：technical（技术性）
- **长度**：long（长篇）
- **关键词**：数据类型, 基本类型, 引用类型, 类型转换, 数组, 对象

#### 3. JavaScript 运算符与流程控制
```
详细讲解 JavaScript 的算术运算符、比较运算符和逻辑运算符，以及如何使用条件语句（if-else、switch）和循环语句（for、while、for...of、for...in）来控制程序流程，最后通过实现一个猜数字游戏来巩固所学知识。
```
- **风格**：practical（实践性）
- **长度**：medium（中等）
- **关键词**：运算符, 条件语句, 循环, if-else, switch, for, while

#### 4. JavaScript 函数的世界
```
全面介绍 JavaScript 函数，包括函数声明和函数表达式的区别、ES6 箭头函数的使用、参数传递和返回值、作用域的概念、闭包的原理和应用场景，并通过实现一个功能完整的计算器来实践函数的使用。
```
- **风格**：technical（技术性）
- **长度**：long（长篇）
- **关键词**：函数, 箭头函数, 作用域, 闭包, 参数, 返回值

#### 5. JavaScript 数组深度解析
```
深入讲解 JavaScript 数组的创建和基本操作，详细介绍常用数组方法（push、pop、shift、unshift、slice、splice）以及高阶方法（map、filter、reduce、find）的使用，通过构建一个待办事项列表应用来实践数组操作。
```
- **风格**：practical（实践性）
- **长度**：long（长篇）
- **关键词**：数组, 数组方法, map, filter, reduce, 高阶函数

#### 6. JavaScript 对象与面向对象编程
```
系统讲解 JavaScript 对象的创建和属性操作，介绍构造函数和原型链的工作原理，详细讲解 ES6 类语法、继承和多态的概念，最后通过实现一个图书管理系统来实践面向对象编程思想。
```
- **风格**：technical（技术性）
- **长度**：long（长篇）
- **关键词**：对象, 面向对象, 类, 继承, 原型链, 构造函数

#### 7. JavaScript 异步编程基础
```
深入讲解 JavaScript 的异步编程模型，从同步和异步的概念开始，介绍回调函数的使用和回调地狱问题，详细讲解 Promise 的使用方法，以及 async/await 语法糖如何让异步代码更优雅，通过模拟 API 请求来实践异步编程。
```
- **风格**：technical（技术性）
- **长度**：long（长篇）
- **关键词**：异步编程, Promise, async, await, 回调函数

#### 8. JavaScript DOM 操作与事件处理
```
全面介绍 DOM 树的结构，如何使用 JavaScript 选择和操作 DOM 元素，讲解事件监听、事件冒泡和事件捕获的概念，通过构建一个交互式网页来实践 DOM 操作和事件处理。
```
- **风格**：practical（实践性）
- **长度**：long（长篇）
- **关键词**：DOM, 事件, 事件监听, 事件冒泡, 元素操作

---

### TypeScript 进阶篇

#### 1. TypeScript 入门指南
```
为 JavaScript 开发者介绍 TypeScript，讲解为什么需要 TypeScript、类型系统的优势、如何搭建和配置 TypeScript 开发环境，并编写第一个 TypeScript 程序，展示 TypeScript 相比 JavaScript 的改进。
```
- **风格**：friendly（友好）
- **长度**：medium（中等）
- **关键词**：TypeScript, 入门, 类型系统, 环境配置, 安装

#### 2. TypeScript 基础类型注解
```
详细讲解 TypeScript 的基本类型注解，包括 string、number、boolean 等基本类型的使用，数组和元组的类型定义，枚举类型的应用，以及 any 和 unknown 的区别和使用场景，通过构建一个类型安全的配置管理工具来实践。
```
- **风格**：technical（技术性）
- **长度**：long（长篇）
- **关键词**：类型注解, 数组, 元组, 枚举, any, unknown

#### 3. TypeScript 接口与类型别名
```
深入讲解 TypeScript 接口的定义和使用，包括可选属性和只读属性的设置，类型别名的概念和应用，字面量类型的使用，通过定义完善的用户模型来展示接口和类型别名的实际应用。
```
- **风格**：technical（技术性）
- **长度**：long（长篇）
- **关键词**：接口, 类型别名, 可选属性, 字面量类型

#### 4. TypeScript 函数与类的类型定义
```
全面介绍 TypeScript 中函数的类型注解、泛型函数的定义和使用，类的类型定义、访问修饰符（public、private、protected）的使用，以及 TypeScript 的类型推断机制，通过实现一个数据验证工具来实践这些概念。
```
- **风格**：technical（技术性）
- **长度**：long（长篇）
- **关键词**：函数类型, 泛型, 类, 访问修饰符, 类型推断

#### 5. TypeScript 泛型编程
```
深入讲解 TypeScript 泛型的概念和应用，包括泛型函数的定义、泛型约束的使用、泛型接口和泛型类的实现，展示如何通过泛型实现代码复用和类型安全，通过实现通用的 API 响应处理来实践泛型编程。
```
- **风格**：technical（技术性）
- **长度**：long（长篇）
- **关键词**：泛型, 泛型约束, 泛型接口, 泛型类, 类型复用

#### 6. TypeScript 高级类型与工具类型
```
讲解 TypeScript 的高级类型特性，包括联合类型和交叉类型的使用、类型守卫的实现、映射类型和条件类型的应用，详细介绍常用工具类型（Partial、Required、Pick、Record 等），通过构建一个类型安全的表单系统来综合应用这些高级特性。
```
- **风格**：technical（技术性）
- **长度**：long（长篇）
- **关键词**：联合类型, 交叉类型, 类型守卫, 映射类型, 条件类型, 工具类型

---

### React 实战篇

#### 1. React 核心概念入门
```
为初学者介绍 React 的基本概念，包括 React 是什么、为什么选择 React、JSX 语法的使用、虚拟 DOM 和 Diff 算法的原理，以及如何使用 Vite 搭建 React 开发环境，帮助新手快速上手 React 开发。
```
- **风格**：friendly（友好）
- **长度**：medium（中等）
- **关键词**：React, JSX, 虚拟DOM, 组件, Vite

#### 2. React 组件基础
```
深入讲解 React 组件的基础知识，包括函数组件和类组件的区别、Props 的传递和使用、State 状态管理的基本概念、事件处理的实现方式，以及 useState Hook 的使用，通过构建一个计数器组件来实践这些概念。
```
- **风格**：practical（实践性）
- **长度**：long（长篇）
- **关键词**：函数组件, Props, State, 事件处理, useState

#### 3. React Hooks 深入讲解
```
全面介绍 React Hooks 的使用，包括 useState、useEffect 处理副作用、useContext 管理全局状态、useReducer 复杂状态管理、useMemo 和 useCallback 性能优化，通过构建一个个人待办应用来综合实践各种 Hooks。
```
- **风格**：technical（技术性）
- **长度**：long（长篇）
- **关键词**：Hooks, useEffect, useContext, useReducer, useMemo, useCallback

#### 4. React 组件设计模式
```
讲解 React 组件的设计原则和常用模式，包括组件拆分原则、受控组件与非受控组件、组合模式和渲染 props 的应用、高阶组件（HOC）的实现，通过构建一个通用的表单组件来实践这些设计模式。
```
- **风格**：technical（技术性）
- **长度**：long（长篇）
- **关键词**：组件设计, 受控组件, 组合模式, 高阶组件, HOC

#### 5. React Router 路由与导航
```
详细介绍 React Router 的使用，包括路由配置、嵌套路由的实现、路由参数和查询参数的获取、编程式导航的方法，通过构建一个多页面博客系统来实践路由的各种功能。
```
- **风格**：practical（实践性）
- **长度**：long（长篇）
- **关键词**：React Router, 路由, 嵌套路由, 路由参数, 编程式导航

#### 6. React 状态管理进阶
```
深入讲解 React 状态管理的解决方案，包括 Context API 的深度使用、Redux 的基础概念和工作原理、Zustand 轻量级状态管理的使用，通过实现一个完整的购物车功能来实践不同的状态管理方案。
```
- **风格**：technical（技术性）
- **长度**：long（长篇）
- **关键词**：Context API, Redux, Zustand, 状态管理, 购物车

#### 7. React API 交互与数据获取
```
全面讲解在 React 中进行 API 交互的方法，包括 Fetch API 和 Axios 的使用、React Query（TanStack Query）进行数据缓存和状态管理、错误处理和加载状态的实现，通过构建一个用户管理系统来实践 API 交互。
```
- **风格**：practical（实践性）
- **长度**：long（长篇）
- **关键词**：API, Fetch, Axios, React Query, 数据获取, 错误处理

#### 8. React 最佳实践与项目优化
```
总结 React 开发的最佳实践，包括组件性能优化技巧、代码组织和项目结构的建议、使用 Jest 和 React Testing Library 进行测试入门、应用部署和生产环境优化的方法，帮助开发者构建高质量的 React 应用。
```
- **风格**：technical（技术性）
- **长度**：long（长篇）
- **关键词**：性能优化, 代码组织, 测试, Jest, 部署, 项目结构

---

## 💡 使用建议

### 按顺序学习
建议按照上述顺序生成文章，每个系列内部的文章是循序渐进设计的。

### 文章发布策略
1. **JavaScript 篇**：每周 2 篇，用 4 周完成
2. **TypeScript 篇**：每周 1.5 篇，用 4 周完成
3. **React 篇**：每周 2 篇，用 4 周完成

### 内容优化
- 生成后检查代码示例的正确性
- 补充实际项目中的应用场景
- 添加练习题和思考题
- 为每篇文章添加目录和导航

### 互动设计
- 在文章末尾添加"下一篇"链接
- 创建系列文章索引页面
- 鼓励读者在评论区提问和讨论

---

## 🎯 写作风格说明

- **friendly（友好）**：适合完全新手，语言通俗易懂，多用比喻和类比
- **technical（技术性）**：深入讲解技术细节，包含原理说明和底层机制
- **practical（实践性）**：注重实际应用，包含大量代码示例和实战项目

---

## 📞 技术支持

如有问题或需要帮助，请随时询问！
