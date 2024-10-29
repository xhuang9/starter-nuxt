// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss"],
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  runtimeConfig: {
    public: {
      AUTH_HEADER: process.env.AUTH_HEADER,
      GQL_HOST: process.env.GQL_HOST,
      LIVE_PREVIEW: process.env.LIVE_PREVIEW === 'true',
      CRAFT_URL: process.env.CRAFT_URL,
      BASE_URL: process.env.BASE_URL
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