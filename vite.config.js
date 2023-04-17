import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    server: {
      host: '0.0.0.0',
      port: env.VITE_PORT,
      open: false,
    },
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'mock',
      }),
    ],
    build: {
      outDir: './dist',
      assetsDir: 'assets',
      sourcemap: true,
      emptyOutDir: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    esbuild: {
      drop: ['console', 'debugger'],
      minify: true,
    },

  }
})
