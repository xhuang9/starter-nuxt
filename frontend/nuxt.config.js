// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "nuxt-graphql-client"],
  runtimeConfig: {
    public: {
      GQL_HOST: process.env.GQL_HOST,
      AUTH_HEADER: process.env.AUTH_HEADER,
      LIVE_PREVIEW: process.env.LIVE_PREVIEW === 'true',
      CRAFT_URL: process.env.CRAFT_URL,
    }
  },
  'graphql-client': {
    clients: {
      default: {
        host: process.env.GQL_HOST
      },
      posts: {
        host: process.env.GQL_HOST,
        token: {
          type: 'Bearer',
          name: 'Authorization',
          value: process.env.AUTH_HEADER
        },
        retainToken: true,
        enableMutation: true
      }
    }
  }
});