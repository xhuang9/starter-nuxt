/**
 * Shared GraphQL client logic for both server-side (nuxt.config.js) and client-side (composables)
 */

/**
 * Creates a GraphQL client with the provided configuration
 * @param {Object} config - Configuration object
 * @param {string} config.CRAFT_URL - The URL of the Craft CMS instance
 * @param {string} config.GRAPHQL_TOKEN - The GraphQL API token
 * @returns {Object} GraphQL client with query method
 */
export const createGraphQLClient = (config) => {
  /**
   * Execute a GraphQL query
   * @param {string} queryStr - The GraphQL query string
   * @param {Object} variables - Variables for the GraphQL query
   * @param {Object} options - Additional options
   * @param {boolean} options.private - Whether to use authentication
   * @param {string} options.previewToken - Preview token for draft content
   * @returns {Promise<Object>} Query result data
   */
  const query = async (queryStr, variables = {}, options = {}) => {
    try {
      if (!config.CRAFT_URL) {
        throw new Error('CRAFT_URL is not configured');
      }

      let apiUrl = `${config.CRAFT_URL}/api`;

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      // Add auth header if private flag is true or token is provided
      if (options.private || config.GRAPHQL_TOKEN) {
        headers['Authorization'] = `Bearer ${config.GRAPHQL_TOKEN}`;
      }

      if (options.previewToken) {
        headers['X-Craft-Token'] = options.previewToken;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: queryStr,
          variables
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();

      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response format');
      }

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'GraphQL error');
      }

      return result.data;
    } catch (err) {
      console.error('GraphQL Error:', {
        message: err.message,
        craftUrl: config.CRAFT_URL
      });
      throw err;
    }
  };

  return { query };
};
