import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from '#app'

export function usePaginatedData(fetchData, initialItemsPerPage = 3) {
  const route = useRoute()
  const router = useRouter()
  
  // Initialize currentPage from route query or default to 1
  const currentPage = ref(parseInt(route.query.page) || 1)
  const itemsPerPage = ref(initialItemsPerPage)
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)

  const totalPosts = computed(() => {
    console.log('Computing total from:', data.value)
    return data.value?.total || 0
  })

  const totalPages = computed(() => {
    const total = totalPosts.value
    const perPage = itemsPerPage.value
    const pages = perPage > 0 ? Math.ceil(total / perPage) : 0
    console.log('Computing pages:', { total, perPage, pages })
    return pages
  })

  const fetchPageData = async (page = currentPage.value) => {
    loading.value = true
    error.value = null
    try {
      const result = await fetchData(page, itemsPerPage.value)
      if (!result) {
        throw new Error('No data returned from fetch function')
      }
      data.value = result
      currentPage.value = page
    } catch (err) {
      console.error('Error in fetchPageData:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const updateCurrentPage = async (newPage) => {
    if (newPage > 0 && newPage <= totalPages.value && newPage !== currentPage.value) {
      // Update the URL first
      await router.push({
        query: { 
          ...route.query,
          page: newPage 
        }
      })
    }
  }

  // Watch for route changes (handles browser back/forward)
  watch(
    () => route.query.page,
    async (newPage) => {
      const page = parseInt(newPage) || 1
      if (page !== currentPage.value) {
        await fetchPageData(page)
      }
    }
  )

  // Initial data fetch
  onMounted(() => {
    fetchPageData(currentPage.value)
  })

  return {
    currentPage,
    itemsPerPage,
    data,
    totalPages,
    loading,
    error,
    updateCurrentPage,
    fetchPageData
  }
}