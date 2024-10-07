import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  console.log('Server config:', config) // For debugging

  const craftUrl = config.CRAFT_URL

  if (!craftUrl) {
    console.error('CRAFT_URL is not defined in server environment')
    throw createError({
      statusCode: 500,
      statusMessage: 'CRAFT_URL is not defined in server environment',
    })
  }

  try {
    const url = `${craftUrl}/actions/users/session-info`
    console.log('Fetching from:', url) // For debugging
    
    const data = await $fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    })
    
    console.log('Response data:', data) // For debugging
    
    return { csrfToken: data.csrfTokenValue }
  } catch (error) {
    console.error('Error fetching CSRF token:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch CSRF token: ' + error.message,
    })
  }
})