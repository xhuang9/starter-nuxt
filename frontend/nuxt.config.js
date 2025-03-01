import { generatePageRoutes, addRoutesToPrerender } from './utils/routes';

// Get the current environment
const environment = process.env.ENV || 'dev';
console.log(`Building for environment: ${environment}`);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: environment === 'production', //if true prerendering will fetch on build time, if false prerendering will fetch on runtime
  hooks: {
    async 'nitro:config'(nitroConfig) {
      // Skip if not production environment or in dev mode
      if (environment !== 'production' || nitroConfig.dev) {
        console.log('Skipping route generation for non-prodduction environment');
        return;
      }
      
      console.log('Generating static routes for production build...');
      
      // Generate routes from GraphQL query
      const routes = await generatePageRoutes({
        CRAFT_URL: process.env.CRAFT_URL,
        GRAPHQL_TOKEN: process.env.GRAPHQL_TOKEN
      });
      
      console.log('Generated routes:', routes);
      
      // Add the routes to the prerender configuration
      addRoutesToPrerender(nitroConfig, routes);
    }
  },
  compatibilityDate: '2024-04-03',
  devtools: {
    enabled: true,
    wsUrl: process.env.BASE_URL?.replace('https://', ''),
    port: 3000,
    https: true
  },
  app: {
    head: {
      titleTemplate: '%s | ' + process.env.SITE_NAME,
      title: process.env.SITE_NAME
    }
  },
  modules: ["@nuxtjs/tailwindcss"],
  tailwindcss: {
    configPath: '~/tailwind.config.js',
    exposeConfig: true,
    viewer: true
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  runtimeConfig: {
    public: {
      GRAPHQL_TOKEN: process.env.GRAPHQL_TOKEN,
      CRAFT_URL: process.env.CRAFT_URL,
      BASE_URL: process.env.BASE_URL,
      SITE_NAME: process.env.SITE_NAME
    }
  },
  vite: {
    server: {
      https: true,
      hmr: {
        protocol: 'wss',
        host: process.env.BASE_URL?.replace('https://', ''),
        port: 3000
      },
      allowedHosts: [
        'starter-nuxt.ddev.site',
        '.ddev.site'
      ]
    }
  },
  nitro: {
    devServer: {
      watch: ['./server']
    }
  },
  experimental: {
    payloadExtraction: false
  }
});
