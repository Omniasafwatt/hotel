import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.grandebeach.com',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://api.grandebeach.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
