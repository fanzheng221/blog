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
        manualChunks: {
          'react-vendor': [
              'react',
              'react-dom',
              'react-router-dom',
           ],
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

    // CSS 代码拆分
    cssCodeSplit: true,

    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
