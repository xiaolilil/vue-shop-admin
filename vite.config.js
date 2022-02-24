import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      '@': '/src', // 设置 `@` 指向 `src` 目录
      'components':''
    },
  },
  plugins: [
    vue(),

  ]
})
