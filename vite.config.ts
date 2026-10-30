import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    // Этот плагин автоматически читает "paths" из твоего tsconfig.json
    // и делает так, чтобы Vite понимал символ "@"
    tsconfigPaths()
  ],
  resolve: {
    alias: {
      // Дополнительная явная привязка @ к папке src
      '@': path.resolve(__dirname, './src'),
    },
  },
})