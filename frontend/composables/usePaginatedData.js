import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from '#app'

export function usePaginatedData(fetchData, initialItemsPerPage = 3) {
  const route = useRoute()
  const router = useRouter()
  
  const currentPage = ref(parseInt(route.query.page) || 1)
  const itemsPerPage = ref(initialItemsPerPage)
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)

  const totalPosts = computed(() => data.value?.total || 0)
  const totalPages = computed(() => 
    Math.ceil(totalPosts.value / itemsPerPage.value)
  )

  const fetchPageData = async (page = currentPage.value) => {
    loading.value = true
    error.value = null
    try {
      const result = await fetchData(page, itemsPerPage.value)
      data.value = result
      currentPage.value = page
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const updateCurrentPage = async (newPage) => {
    if (newPage > 0 && newPage <= totalPages.value && newPage !== currentPage.value) {
      await router.push({
        query: { ...route.query, page: newPage }
      })
    }
  }

  watch(() => route.query.page, async (newPage) => {
    const page = parseInt(newPage) || 1
    if (page !== currentPage.value) {
      await fetchPageData(page)
    }
  })

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