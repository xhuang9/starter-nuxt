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
      GQL_HOST: process.env.GQL_HOST,
      CRAFT_URL: process.env.CRAFT_URL,
      BASE_URL: process.env.BASE_URL,
      SITE_NAME: process.env.SITE_NAME,
      ADMIN_USER_ID: process.env.ADMIN_USER_ID
    }
  },
  vite: {
    server: {
      https: true,
      hmr: {
        protocol: 'wss'
      }
    }
  }
});