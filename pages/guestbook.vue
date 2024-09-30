<script setup>
import { usePaginatedData } from '@/composables/usePaginatedData';
import { useRouter } from 'vue-router';

const router = useRouter();
const posts = ref([]);
const content = ref({});

const fetchGuestbookData = async (currentPage, itemsPerPage) => {
  try {
    const result = await useAsyncGql({
      operation: 'Guestbook',
      variables: {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage
      }
    });

    if (!result.data || !result.data.value) {
      console.error('No data returned from GraphQL:', result);
      return null; // Return null if no data is found
    }

    return result.data.value; // Ensure this path is correct
  } catch (error) {
    console.error('Error fetching guestbook data:', error);
    return null; // Return null on error
  }
};

const {
  currentPage,
  itemsPerPage,
  data,
  totalPages,
  loading,
  error,
  updateCurrentPage,
  goBack,
  goForward
} = usePaginatedData(fetchGuestbookData, router);

onMounted(() => {
  fetchGuestbookData(); // Call fetchData when the component is mounted
});
</script>

<template>
  <header class="container mx-auto pt-12 pb-6 px-2 text-2xl">
    <h1 class="font-bold text-4xl sm:text-6xl lg:text-9xl">{{ content.title }}</h1>
    <p v-if="content.pageSubheading">{{ content.pageSubheading }}</p>
  </header>
  <section class="page__content">
    <div class="container mx-auto py-12 px-2 text-balance" v-html="content.pageContent"></div>
  </section>
  <div class="container mx-auto px-2 sm:grid gap-6 grid-cols-2">
    <section class="mb-12">
      <div v-if="error">{{ error.message }}</div> <!-- Display error message -->
      <div v-if="posts.length > 0">
        <ol class="mb-2 divide-y divide-slate-300">
          <li v-for="post in posts" :key="post.id">
            <article class="text-xl py-6">
              <div v-html="post.textBlock"></div>
              <p class="text-sm mt-1">
                <time :datetime="post.postDate">{{ post.postDate }}</time><br />
                By
              </p>
            </article>
          </li>
        </ol>
        <Pagination
          v-if="totalPages > 1"
          :currentPage="currentPage"
          :totalPages="totalPages"
          @update:currentPage="updateCurrentPage" />
      </div>
      <p class="text-2xl" v-else>No entries yet. Create one using the form.</p>
    </section>
    <section>
      <div class="bg-slate-200 p-6 mb-9 rounded">
        <h2 class="font-bold text-3xl mb-4">Post an entry</h2>
        <PostForm />
        <SignInForm />
      </div>
    </section>
  </div>
</template>
