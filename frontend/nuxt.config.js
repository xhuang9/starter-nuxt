// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  app: {
    head: {
      titleTemplate: '%s | ' + process.env.SITE_NAME,
      title: process.env.SITE_NAME
    }
  },
  modules: ["@nuxtjs/tailwindcss"],
  tailwindcss: {
    configPath: '~/tailwind.config.js',
    exposeConfig: true,
    viewer: true
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  runtimeConfig: {
    public: {
      AUTH_HEADER: process.env.AUTH_HEADER,
      CRAFT_URL: process.env.CRAFT_URL,
      BASE_URL: process.env.BASE_URL,
      SITE_NAME: process.env.SITE_NAME
    }
  },
  vite: {
    server: {
      https: true,
      hmr: {
        protocol: 'wss'
      }
    }
  },
  nitro: {
    devProxy: {
      '/api': {
        target: process.env.CRAFT_URL,
        changeOrigin: true,
        secure: false,
        ws: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    },
    devServer: {
      watch: ['./server']
    }
  },
  experimental: {
    payloadExtraction: false
  }
});
