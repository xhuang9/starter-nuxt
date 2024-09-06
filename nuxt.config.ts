// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "nuxt-graphql-client"],
  runtimeConfig: {
    public: {
      GQL_HOST: process.env.GQL_HOST
    }
  }
})