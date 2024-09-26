// composables/usePaginatedData.js
import { ref, computed, watch, onMounted } from 'vue';

export function usePagination (fetchData, itemsPerPage = 3) {
  const currentPage = ref(1);
  const loading = ref(true);
  const error = ref(null);
  const data = ref(null); // This will hold the fetched data

  const totalPosts = computed(() => {
    return data.value?.entryCount || 0; // Default to 0 if entryCount is undefined
  });

  const totalPages = computed(() => {
    return itemsPerPage > 0 ? Math.ceil(totalPosts.value / itemsPerPage) : 0; // Return 0 if itemsPerPage is 0
  });

  const fetchPageData = async () => {
    loading.value = true;
    try {
      data.value = await fetchData(currentPage.value, itemsPerPage);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchPageData);
  watch(currentPage, fetchPageData);

  const updateCurrentPage = (newPage) => {
    currentPage.value = newPage;
  };

  return {
    currentPage,
    itemsPerPage,
    data,
    totalPages,
    loading,
    error,
    updateCurrentPage
  };
}