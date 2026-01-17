import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    // 启用源码映射，便于调试
    sourcemap: false,

    // 设置 chunk 大小警告阈值
    chunkSizeWarningLimit: 1000,

    // 自定义 rollup 选项
    rollupOptions: {
      output: {
        // 手动代码拆分策略
        manualChunks: (id) => {
          // React 核心
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }

          // React Router
          if (id.includes('node_modules/react-router')) {
            return 'router'
          }

          // UI 组件库 - Radix UI
          if (id.includes('node_modules/@radix-ui')) {
            return 'radix-ui'
          }

          // 图标库
          if (id.includes('node_modules/lucide-react')) {
            return 'icons'
          }

          // 表单相关
          if (
            id.includes('node_modules/react-hook-form') ||
            id.includes('node_modules/@hookform') ||
            id.includes('node_modules/zod')
          ) {
            return 'forms'
          }

          // Markdown 相关
          if (
            id.includes('node_modules/react-markdown') ||
            id.includes('node_modules/remark') ||
            id.includes('node_modules/rehype')
          ) {
            return 'markdown'
          }

          // 日期处理
          if (id.includes('node_modules/date-fns')) {
            return 'date-utils'
          }

          // 工具库
          if (
            id.includes('node_modules/axios') ||
            id.includes('node_modules/clsx') ||
            id.includes('node_modules/class-variance-authority') ||
            id.includes('node_modules/tailwind-merge')
          ) {
            return 'utils'
          }

          // 轮播图和可调整面板
          if (
            id.includes('node_modules/embla-carousel') ||
            id.includes('node_modules/react-resizable-panels')
          ) {
            return 'ui-components'
          }

          // 其他第三方库
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },

        // chunk 文件命名规范
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || ''
          // 按文件类型分类
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(name)) {
            return 'assets/media/[name]-[hash][extname]'
          }
          if (/\.(png|jpe?g|gif|svg|ico|avif|webp)(\?.*)?$/i.test(name)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(name)) {
            return 'assets/fonts/[name]-[hash][extname]'
          }
          if (name.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[ext]/[name]-[hash][extname]'
        },
      },
    },

    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: ['log', 'info'],
        drop_debugger: true,
      },
    },

    // CSS 代码拆分
    cssCodeSplit: true,

    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
