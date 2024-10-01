// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "nuxt-graphql-client"],
  'graphql-client': {
    clients: {
      default: {
        livePreview: process.env.LIVE_PREVIEW === 'true',
        host: process.env.GQL_HOST,
        token: process.env.LIVE_PREVIEW === 'true' ? process.env.AUTH_HEADER : '',
      },
      posts: {
        host: process.env.GQL_HOST,
        token: process.env.AUTH_HEADER
      }
    },
    tokenStorage: {
      name: '__session',
      mode: 'cookie', // default
      cookieOptions: {
        path: '/',
        secure: true, // defaults to `process.env.NODE_ENV === 'production'`
        httpOnly: false, // Only accessible via HTTP(S)
        maxAge: 60 * 60 * 24 * 5 // 5 days
      }
    } 
  }
});