<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // or from '#app' if using Nuxt
import { usePaginatedData } from '@/composables/usePaginatedData';

const route = useRoute();
const router = useRouter();

const fetchGuestbookData = async (page, perPage) => {
  console.log(`Fetching guestbook data for page ${page} with ${perPage} items per page`);
  try {
    const result = await GqlGuestbook({
      limit: perPage,
      offset: (page - 1) * perPage
    });
    console.log('Raw GraphQL result:', JSON.stringify(result, null, 2));
    
    if (!result) {
      throw new Error('No result returned from GraphQL query');
    }
    
    if (!result.postsEntries) {
      console.error('Missing postsEntries in GraphQL response:', result);
      throw new Error('Invalid GraphQL response: missing postsEntries');
    }
    
    return {
      postsEntries: result.postsEntries,
      guestbookEntries: result.guestbookEntries || [],
      entryCount: result.entryCount || 0
    };
  } catch (error) {
    console.error('Error fetching guestbook data:', error);
    throw error;
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
  fetchPageData
} = usePaginatedData(fetchGuestbookData, router);

// Watch for changes in the route's query parameters
watch(
  () => route.query,
  (newQuery) => {
    const newPage = parseInt(newQuery.page) || 1;
    if (newPage !== currentPage.value) {
      currentPage.value = newPage;
    }
  }
);

onMounted(() => {
  const pageFromQuery = parseInt(route.query.page) || 1;
  currentPage.value = pageFromQuery;
  fetchPageData(currentPage.value);
});

// Extract posts from the data
const posts = computed(() => data.value?.postsEntries || []);
const content = computed(() => data.value?.guestbookEntries[0] || { title: '', pageSubheading: '', pageContent: '' });
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
