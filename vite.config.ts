import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import { resolve } from "path";
import sass from "sass";

export default defineConfig(({ mode }) => {
  // Carrega as variáveis do .env
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue({
        template: { transformAssetUrls },
      }),
      quasar({
        sassVariables: resolve(__dirname, "src/styles/quasar-variables.sass"),
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL),
    },
    server: {
      port: 3000,
    },
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          implementation: sass,
        },
      },
    },
  };
});
