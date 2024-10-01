// composables/usePaginatedData.js
import { ref, computed, watch } from 'vue';

export function usePaginatedData(fetchData, router = null, initialItemsPerPage = 3) {
  const currentPage = ref(1);
  const itemsPerPage = ref(initialItemsPerPage);
  const loading = ref(false);
  const error = ref(null);
  const data = ref(null);

  const totalPosts = computed(() => data.value?.entryCount || 0);
  const totalPages = computed(() => itemsPerPage.value > 0 ? Math.ceil(totalPosts.value / itemsPerPage.value) : 0);

  const fetchPageData = async (page = currentPage.value) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await fetchData(page, itemsPerPage.value);
      console.log('Fetched result:', result);
      if (!result) {
        throw new Error('No data returned from fetch function');
      }
      data.value = result;
      currentPage.value = page;
    } catch (err) {
      console.error('Error in fetchPageData:', err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const updateCurrentPage = (newPage) => {
    if (newPage > 0 && newPage <= totalPages.value && newPage !== currentPage.value) {
      currentPage.value = newPage;
      if (router && router.currentRoute) {
        router.push({ query: { ...router.currentRoute.value.query, page: newPage } });
      } else {
        fetchPageData(newPage);
      }
    }
  };

  watch(currentPage, fetchPageData);

  return {
    currentPage,
    itemsPerPage,
    data,
    totalPages,
    loading,
    error,
    updateCurrentPage,
    fetchPageData
  };
}