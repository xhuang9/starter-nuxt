export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const craftUrl = config.CRAFT_URL

  if (!craftUrl) {
    console.error('CRAFT_URL is not defined in server environment') // Add this line for debugging
    throw createError({
      statusCode: 500,
      statusMessage: 'CRAFT_URL is not defined in server environment',
    })
  }

  try {
    console.log('Fetching from:', `${craftUrl}/actions/users/session-info`) // Add this line for debugging
    const response = await fetch(`${craftUrl}/actions/users/session-info`, {
      headers: {
        'Accept': 'application/json',
      },
    })
    const data = await response.json()
    return { csrfToken: data.csrfTokenValue }
  } catch (error) {
    console.error('Error fetching CSRF token:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch CSRF token',
    })
  }
})