/**
 * Utilities for route generation in Nuxt
 */
import { BUILD_QUERY } from '../queries/build.mjs';
import { createGraphQLClient } from './graphql';

/**
 * Fetches page slugs from the GraphQL API and generates routes
 * @param {Object} config - Configuration object with CRAFT_URL and GRAPHQL_TOKEN
 * @returns {Promise<string[]>} Array of route paths
 */
export const generatePageRoutes = async (config) => {
  try {
    // Create a GraphQL client
    const graphQLClient = createGraphQLClient(config);
    
    // Execute the query
    const data = await graphQLClient.query(BUILD_QUERY);
    
    // Extract the slugs from the response
    const pages = data?.pagesEntries || [];
    
    // Map the pages to routes
    const routes = pages.map(page => `/${page.slug}`);
    
    return routes;
  } catch (error) {
    console.error('Error generating routes:', error);
    return [];
  }
};

/**
 * Adds routes to Nitro's prerender configuration
 * @param {Object} nitroConfig - Nitro configuration object
 * @param {string[]} routes - Array of routes to add
 */
export const addRoutesToPrerender = (nitroConfig, routes) => {
  if (!nitroConfig.prerender) {
    nitroConfig.prerender = {};
  }
  if (!nitroConfig.prerender.routes) {
    nitroConfig.prerender.routes = [];
  }
  nitroConfig.prerender.routes.push(...routes);
};
