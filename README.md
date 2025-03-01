# Craft CMS + Nuxt Starter Hosting on Netlify with SSG and Prerendering

This project is forked from the [Craft CMS + Nuxt Starter](https://github.com/craftcms/starter-nuxt) and modified to be hosted on Netlify with static site generation (SSG) and prerendering.

This project will expect you deploy your site like this:

1. Craft CMS backend hosted on a server of your choice
2. Nuxt frontend hosted on Netlify, with three build environments: `staging`, `preview`, and `production`

   - `ENV=production`: uses SSG and prerendering to cache all page content statically on netlify. Deploy with `master` branch.
   - `ENV=preview`: uses nuxt as a front-end spa, reacts instantly to your changes in the Craft CMS backend. Uses for the live preview feature. Deploy with `master` branch.
   - `ENV=staging`: uses nuxt as a front-end spa, reacts instantly to your changes in the Craft CMS backend. Uses as staging branch for dev purposes. Should deploy with `staging` or `uat` branch.

To get started, clone this repository and run the following commands:

Following steps over at: https://github.com/craftcms/starter-nuxt?tab=readme-ov-file#quick-start

## Deployment

1. Update the `/frontend/queries/build.mjs` make sure it selects all craft cms entries' uri you want to prerender.
2. Update the `netlify.toml` file with your site's address.

   - [https://api.nuxt-starter.yourdomain.com] Replace with your Craft CMS backend address.
   - [https://nuxt-starter.netlify.app] Replace with your SSG production address.
   - [https://nuxt-starter-preview.netlify.app] Replace with your SPA preview address.
   - [https://nuxt-starter-staging.netlify.app] Replace with your SPA staging address.

## Why we are not using SSR?

SSR requires extra server resources and is not necessary for most websites. SSG and prerendering are more than enough for most websites. With graphql you can always limit the data you need to fetch and cache the data on the client side.
