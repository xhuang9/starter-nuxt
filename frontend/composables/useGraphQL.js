import { useRuntimeConfig } from '#app'

export function useGraphQL() {
  const config = useRuntimeConfig()
  
  const query = async (query, variables = {}, options = {}) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      }

      // Add auth header if private flag is true
      if (options.private) {
        headers['Authorization'] = `Bearer ${config.public.AUTH_HEADER}`
      }

      // Add preview token if it exists
      if (options.previewToken) {
        headers['X-Craft-Token'] = options.previewToken
      }

      // Add any additional headers from options
      if (options.headers) {
        Object.assign(headers, options.headers)
      }

      const result = await $fetch(config.public.GQL_HOST, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
          variables
        })
      })

      if (result.errors) {
        throw new Error(result.errors[0].message)
      }

      return result.data
    } catch (err) {
      console.error('GraphQL Error:', err)
      throw err
    }
  }

  return {
    query
  }
}