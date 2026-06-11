import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',  // 기본값, 변경하지 않았다면 괜찮음
  base: '/',  // 기본값
})
