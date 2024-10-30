import { useRuntimeConfig } from '#app'

export const useGraphQL = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.GQL_HOST

  const query = async (queryStr, variables = {}, options = {}) => {
    const { previewToken, headers = {} } = options

    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers
    }

    if (previewToken) {
      requestHeaders['X-Craft-Token'] = previewToken
    }

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
          query: queryStr,
          variables
        })
      })

      const result = await response.json()

      if (result.errors) {
        throw new Error(result.errors[0].message)
      }

      return result.data
    } catch (error) {
      console.error('GraphQL Error:', error)
      throw error
    }
  }

  return {
    query
  }
}