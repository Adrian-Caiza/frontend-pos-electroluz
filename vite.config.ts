import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_API_URL || 'http://localhost:3000'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      proxy: {
        '/uploads': {
          target,
          changeOrigin: true,
        },
        '/api-proxy': {
          target,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-proxy/, '')
        }
      }
    }
  }
})