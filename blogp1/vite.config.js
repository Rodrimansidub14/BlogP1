import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: 'inline',
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://blogp1-1.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
