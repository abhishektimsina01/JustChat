import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:8001'

  return {
    plugins: [react()],
    server: {
      port: 5174,
      proxy: {
        // Proxy REST API calls during development to the backend
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
        },
        // Proxy Socket.IO websocket connections
        '/socket.io': {
          target: apiBaseUrl,
          ws: true,
        },
      },
    },
  }
})
