import { useRuntimeConfig } from '#app'
import { createGraphQLClient } from '../utils/graphql'

/**
 * Composable for making GraphQL queries in the Nuxt application
 * @returns {Object} GraphQL client with query method
 */
export function useGraphQL() {
  const config = useRuntimeConfig()
  
  // Create a GraphQL client using the runtime config
  const graphQLClient = createGraphQLClient({
    CRAFT_URL: config.public.CRAFT_URL,
    GRAPHQL_TOKEN: config.public.GRAPHQL_TOKEN
  })
  
  // Wrap the query method to ensure data is properly serialized for Nuxt
  const query = async (queryStr, variables = {}, options = {}) => {
    try {
      const data = await graphQLClient.query(queryStr, variables, options)
      // Ensure the data is properly serialized for Nuxt
      return JSON.parse(JSON.stringify(data))
    } catch (error) {
      console.error('GraphQL Error in composable:', error.message)
      throw error
    }
  }

  return { query }
}
