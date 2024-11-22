# Craft CMS + Nuxt Starter

A minimal, production-ready starter for Nuxt 3 and Craft CMS 5 projects. Check out the [features](#key-features), or [dive right in](#quick-start)!

> [!TIP]
> Curious about Craft, but want to try it with a different framework? We have [other starter projects](https://craftcms.com/starters), too!

## Quick Start

1. Clone this repository, and move into the new directory:
    ```bash
    git clone https://github.com/craftcms/starter-nuxt.git
    # ...
    cd starter-nuxt
    ```

1. Optional: Change the default domains (Defaults: Frontend = https://starter-nuxt.ddev.site, Backend = https://api.starter-nuxt.ddev.com):

    - Edit `.ddev/config.yaml`
        - Update `name`
        - Change the front end and backend domains under `additional_fqdns`
        - Change the front end, backend, and virtual host domains under `web_environment`
    - Change the `server_name` in `.ddev/nginx_full/api-site.conf` to match backend url
    - Change the `server_name` in `.ddev/nginx_full/nuxt-site.conf` to match frontend url

1. Set up your Craft CMS backend:

    ```bash
    ddev composer install
    ddev craft install
    ```

1. Generate a token for the _Posts_ GraphQL Schema:

    ```bash
    # Display a list of schemas and UUIDs:
    ddev craft graphql/list-schemas

    # Use the “Posts” schema ID to generate a token:
    ddev craft graphql/create-token c7d2eb61-cdde-4a76-88a9-eb30ddcf155b
    ```

1. Configure your frontend environment:

    - Copy `frontend/.env.example` to `frontend/.env`;
    - Update to match your Craft installation;
    - Update `AUTH_HEADER` to the token generated in the previous step;

1. Install front-end dependencies:

    ```bash
    ddev fe npm install
    ```

1. Start the Nuxt development server:

    ```bash
    ddev fe npm run dev
    ```

You’re done! Run `ddev launch` to open the front-end in your default browser, or visit `https://starter-nuxt.ddev.site`.


## Key Features

### Pagination
The starter includes a reusable pagination system that:
- Maintains page state in the URL
- Supports browser back/forward navigation
- Shows loading states during transitions

### Preview Mode
Full support for Craft CMS preview functionality:
- Live preview while editing
- Shareable preview URLs
- Token-based authentication

### GraphQL Integration
Clean GraphQL implementation with:
- Error handling
- Preview token support
- Pagination support

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
