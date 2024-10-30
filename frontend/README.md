# Nuxt + Craft CMS Starter

A minimal, production-ready starter for Nuxt 3 and Craft CMS 5 projects.

## Features
- 🚀 Nuxt 3 + Craft CMS 5
- 📱 Responsive pagination
- 🔍 Preview mode support
- 📝 Blog and Guestbook examples
- 🎨 TailwindCSS styling

## Project Structure
├── components/ # Reusable Vue components
│ ├── Pagination.vue # Shared pagination component
│ ├── PostForm.vue # Guestbook form component
│ └── Teaser.vue # Blog post preview component
├── composables/ # Shared composable functions
│ ├── useGraphQL.js # GraphQL client setup
│ ├── usePreview.js # Craft preview mode handler
│ └── usePaginatedData.js # Pagination logic
├── pages/ # File-based routing
│ ├── article/ # Individual article pages
│ ├── blog.vue # Blog listing page
│ └── guestbook.vue # Guestbook page with form
└── queries/ # GraphQL query definitions
├── article.mjs # Single article query
├── blog.mjs # Blog listing query
└── guestbook.mjs # Guestbook queries

## Quick Start

1. Clone this repository
2. Set up your Craft CMS backend:
   ```bash
   cd craft
   composer install
   ./craft setup
   ```

3. Set up your Nuxt frontend:
   ```bash
   cd frontend
   npm install
   ```

4. Configure your environment:
   - Copy `.env.example` to `.env`
   - Update the CRAFT_API_URL to match your Craft installation

5. Start development:
   ```bash
   npm run dev
   ```

## GraphQL Setup

1. In Craft CMS admin:
   - Enable GraphQL under Settings → GraphQL
   - Create a new Schema with access to:
     - Blog entries
     - Article entries
     - Guestbook entries
   - Generate a token and add it to your `.env`

2. Test your queries in the GraphQL Explorer at:
   `your-craft-site.test/admin/graphql`

## Environment Variables
env
Craft CMS API URL
CRAFT_API_URL=http://starter-craft.ddev.site
GraphQL token (generate in Craft admin)
GRAPHQL_TOKEN=your-token-here
Preview mode settings
PREVIEW_SECRET=your-preview-secret

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
