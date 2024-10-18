module.exports = {
  apps : [
    {
      name: "frontend",
      cwd: "/var/www/html/frontend",
      script: "npm run dev || (rm -rf node_modules && npm install && npm run dev)"
    },
    {
      name: "backend",
      cwd: "/var/www/html/backend",
      script: "npm run dev || (rm -rf node_modules && npm install && npm run dev)"
    }
  ]
}