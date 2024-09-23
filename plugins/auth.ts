export default defineNuxtPlugin((nuxtApp) => {
  // access cookie for auth
  const cookie = useCookie('<cookie_name>')

  nuxtApp.hook('gql:auth:init', ({ client, token }) => {
    // `client` can be used to differentiate logic on a per client basis.

    // apply client token
    token.value = '<secret_token>'
  })
})