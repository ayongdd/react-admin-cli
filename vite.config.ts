import { type ConfigEnv, defineConfig, loadEnv, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteCompression from 'vite-plugin-compression'

export default defineConfig((config: ConfigEnv): UserConfig => {
  const env = loadEnv(config.mode, process.cwd())
  const isBuild = config.command === 'build'
  return {
    base: env.VITE_APP_CONTEXT_PATH,
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    plugins: [
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_TITLE
          }
        }
      }),
      isBuild &&
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
      })
    ],
    server: {
      host: true,
      port: Number(env.VITE_APP_PORT),
      open: false,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: 'http://192.168.254.61:18081/',
          changeOrigin: true,
          ws: true,
        }
      }
    },
    build: {
      target: 'es2015',
      reportCompressedSize: false, // 启用/禁用 gzip 压缩大小报告
      chunkSizeWarningLimit: 1024 // chunk 大小警告的限制（单位kb）
    }
  }
})
