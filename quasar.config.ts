import { configure } from 'quasar/wrappers'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

interface QuasarConfig {
  devServer?: {
    open: boolean
    port: number
    host: string
    proxy: Record<string, string | object>
  }
  build?: {
    env?: Record<string, string>
    vitePlugins?: any[]
  }
  css?: {
    preprocessorOptions?: {
      sass?: object
      scss?: object
    }
  }
}

export default configure((ctx) => {
  const env = loadEnv(ctx.mode, process.cwd(), '')

  return {
    devServer: {
      open: true,
      port: 9000,
      host: 'localhost',
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },

    framework: {
      config: {
        brand: {
          primary: '#1976d2',
          secondary: '#26A69A',
          accent: '#9C27B0'
        }
      },
      plugins: ['Notify', 'Loading', 'Dialog']
    },

    build: {
      env: {
        VITE_API_URL: env.VITE_API_URL
      },
      vitePlugins: [
        vue({
          template: { transformAssetUrls }
        }),
        quasar({
          sassVariables: 'src/styles/quasar-variables.sass',
          autoImportComponentCase: 'kebab'
        })
      ]
    },

    css: {
      preprocessorOptions: {
        sass: {
          additionalData: `@import "src/styles/quasar-variables.sass"\n`
        },
        scss: {
          additionalData: `@import "src/styles/quasar-variables.sass";`
        }
      }
    },

    vitePlugins: [
      {
        name: 'cypress-config',
        config: () => ({
          test: {
            baseUrl: 'http://localhost:9000',
            env: {
              USERNAME: env.CYPRESS_USERNAME,
              PASSWORD: env.CYPRESS_PASSWORD
            }
          }
        })
      }
    ]
  } as QuasarConfig
})
