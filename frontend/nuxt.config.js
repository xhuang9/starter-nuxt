// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "nuxt-graphql-client"],
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  runtimeConfig: {
    CRAFT_URL: process.env.CRAFT_URL,
    public: {
      GQL_HOST: process.env.GQL_HOST,
      AUTH_HEADER: process.env.AUTH_HEADER,
      LIVE_PREVIEW: process.env.LIVE_PREVIEW === 'true',
      CRAFT_URL: process.env.CRAFT_URL,
      BASE_URL: process.env.BASE_URL
    }
  },
  'graphql-client': {
    clients: {
      default: {
        host: process.env.GQL_HOST,
        headers: ({ req }) => {
          if (!req?.url) return {}
          const url = new URL(req.url, 'http://localhost')
          const isPreview = url.searchParams.get('x-craft-live-preview') === 'true'
          const token = url.searchParams.get('x-craft-live-preview')
          return {
            ...(isPreview && token ? { 'X-Craft-Token': token } : {}),
            'X-Craft-Preview': isPreview ? 'true' : 'false'
          }
        }
      },
      posts: {
        host: process.env.GQL_HOST,
        token: {
          type: 'Bearer',
          name: 'Authorization',
          value: process.env.AUTH_HEADER
        },
        retainToken: true
      }
    }
  }
});