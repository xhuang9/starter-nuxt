# Nuxt + Craft CMS Starter

## README UNDER CONSTRUCTION 🚧

A minimal, production-ready starter for Nuxt 3 and Craft CMS 5 projects.

## Features
- 🚀 Nuxt 3 + Craft CMS 5
- 📱 Responsive pagination
- 🔍 Preview mode support
- 📝 Blog and Guestbook examples
- 🎨 TailwindCSS styling

## Project Structure



## Quick Start

1. Clone this repository
   
2. Copy the environment file:
    ```bash
   cp .env.example .env
   ```  

3. Update `.env` with your project settings:
   - Change PROJECT_NAME to your project name
   - Update domains
   - Set your site name

4. Setup ddev environment
   ```bash
   ddev start
   ```

5. Set up your Craft CMS backend:
   ```bash
   cd backend
   ddev composer install
   ddev ./craft setup
   ```

6. Set up your Nuxt frontend:
   ```bash
   cd frontend
   ddev npm install
   ```

7. Configure your environment:
   - Copy `.env.example` to `.env`
   - Update the CRAFT_API_URL to match your Craft installation

8. Start development:
   ```bash
   ddev npm run dev
   ```

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
