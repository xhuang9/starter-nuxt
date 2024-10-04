export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const craftUrl = config.public.CRAFT_URL

  try {
    const response = await fetch(`${craftUrl}/index.php?actions/users/get-csrf-token`, {
      credentials: 'include',
    })
    const data = await response.json()
    return { csrfToken: data.csrfToken }
  } catch (error) {
    console.error('Error fetching CSRF token:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch CSRF token',
    })
  }
})