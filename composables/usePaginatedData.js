// composables/usePaginatedData.js
import { ref, computed, watch, onMounted } from 'vue';

export function usePaginatedData(fetchData, router, initialItemsPerPage = 3) {
  const currentPage = ref(1);
  const itemsPerPage = ref(initialItemsPerPage);
  const loading = ref(false);
  const error = ref(null);
  const data = ref(null); // This will hold the fetched data
  const backStack = ref([]); // History stack for back navigation
  const forwardStack = ref([]); // History stack for forward navigation

  const totalPosts = computed(() => {
    return data.value?.entryCount || 0; // Default to 0 if entryCount is undefined
  });

  const totalPages = computed(() => {
    return itemsPerPage.value > 0 ? Math.ceil(totalPosts.value / itemsPerPage.value) : 0; // Return 0 if itemsPerPage is 0
  });

  const fetchPageData = async () => {
    loading.value = true;
    error.value = null; // Reset error state before fetching
    try {
      data.value = await fetchData(currentPage.value, itemsPerPage.value);
      console.log('Fetched data:', data.value);
    } catch (err) {
      error.value = err; // Capture the error
      console.error('Error fetching data:', err); // Log the error for debugging
    } finally {
      loading.value = false; // Ensure loading is set to false
    }
  };
  

  onMounted(() => {
    // Read the current page from the URL
    const pageFromQuery = parseInt(router.currentRoute.value.query.page) || 1;
    currentPage.value = pageFromQuery;
    fetchPageData();
  });

  watch(currentPage, (newPage) => {
    // Update the URL when the current page changes
    router.push({ query: { page: newPage } });
    fetchPageData();
  });

  const updateCurrentPage = (newPage) => {
    if (newPage > 0 && newPage <= totalPages.value) {
      // Push the current page to back stack before changing
      if (currentPage.value !== newPage) {
        backStack.value.push(currentPage.value);
        forwardStack.value = []; // Clear forward stack on new navigation
      }
      currentPage.value = newPage; // Update current page only if it's valid
    }
  };

  const goBack = () => {
    if (backStack.value.length > 0) {
      forwardStack.value.push(currentPage.value); // Push current page to forward stack
      currentPage.value = backStack.value.pop(); // Go back to the last page in history
      fetchPageData(); // Fetch data after going back
    }
  };

  const goForward = () => {
    if (forwardStack.value.length > 0) {
      backStack.value.push(currentPage.value); // Push current page to back stack
      currentPage.value = forwardStack.value.pop(); // Go forward to the last page in forward history
      fetchPageData(); // Fetch data after going forward
    }
  };

  return {
    currentPage,
    itemsPerPage,
    data,
    totalPages,
    loading,
    error,
    updateCurrentPage,
    goBack, // Expose goBack for back button functionality
    goForward, // Expose goForward for forward button functionality
    fetchPageData // Expose fetchPageData if needed for manual refresh
  };
}