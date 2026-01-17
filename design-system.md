# Design System: 个人博客网站

## 配色方案

### 浅色主题
```css
--color-background: #FAFAF9;      /* Stone-50: 温暖的灰白色背景 */
--color-surface: #FFFFFF;         /* 纯白卡片背景 */
--color-text-primary: #1C1917;    /* Stone-900: 深褐灰主文本 */
--color-text-secondary: #57534E;  /* Stone-600: 中灰次级文本 */
--color-accent: #DC2626;          /* Red-600: 强烈的红色强调 */
--color-accent-hover: #B91C1C;    /* Red-700: 悬停状态 */
--color-border: #E7E5E4;          /* Stone-200: 边框色 */
--color-muted: #A8A29E;           /* Stone-400: 弱化文本 */
```

### 深色主题
```css
--color-background: #0C0A09;      /* Stone-950: 深褐灰背景 */
--color-surface: #1C1917;         /* Stone-900: 卡片背景 */
--color-text-primary: #FAFAF9;    /* Stone-50: 浅色主文本 */
--color-text-secondary: #D6D3D1;  /* Stone-300: 次级文本 */
--color-accent: #EF4444;          /* Red-500: 明亮的红色强调 */
--color-accent-hover: #F87171;    /* Red-400: 悬停状态 */
--color-border: #292524;          /* Stone-800: 边框色 */
--color-muted: #78716C;           /* Stone-500: 弱化文本 */
```

## 字体系统

### 字体选择
```css
/* 标题字体: Instrument Serif - 优雅的衬线字体 */
--font-display: 'Instrument Serif', Georgia, serif;

/* 正文字体: Domaine Sans - 现代 sans-serif */
--font-body: 'DM Sans', -apple-system, sans-serif;

/* 等宽字体: JetBrains Mono - 代码 */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### 字体层次
```
H1 (Hero Title):     64px / 1.1 / font-display / 700
H2 (Page Title):     48px / 1.2 / font-display / 700
H3 (Section):        32px / 1.3 / font-display / 600
H4 (Card Title):     24px / 1.4 / font-display / 600
Body Large:          20px / 1.6 / font-body / 400
Body:                16px / 1.7 / font-body / 400
Body Small:          14px / 1.6 / font-body / 400
Caption:             12px / 1.4 / font-body / 500
```

## 间距系统

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
--space-4xl: 96px;
```

## 圆角系统

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

## 阴影系统

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

## 动画系统

```css
/* 缓动函数 */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* 持续时间 */
--duration-fast: 150ms;
--duration-base: 250ms;
--duration-slow: 400ms;
--duration-slower: 600ms;
```

## 断点系统

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

## 组件规范

### 按钮
- Primary: 红色背景 + 白色文字
- Secondary: 透明背景 + 红色边框
- Ghost: 透明背景 + 红色文字
- 尺寸: sm (32px) | md (40px) | lg (48px)

### 卡片
- 背景色: surface
- 边框: 1px solid border
- 圆角: lg (12px)
- 悬停: 轻微上浮 + 阴影

### 输入框
- 背景: surface
- 边框: 1px solid border
- 圆角: md (8px)
- 聚焦: 红色边框 + 阴影

## 特效元素

### 装饰性元素
1. **斜线分割**: 页面之间的斜线过渡
2. **圆形徽章**: 分类标签的圆形背景
3. **引号装饰**: 引用内容的大型装饰性引号
4. **渐变文字**: Hero 标题的渐变效果

### 动画效果
1. **页面加载**: 元素依次淡入
2. **滚动触发**: 元素从底部滑入
3. **悬停效果**: 卡片轻微上浮
4. **主题切换**: 平滑的颜色过渡
