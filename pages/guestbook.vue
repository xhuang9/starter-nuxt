<template>
  <header class="container mx-auto pt-12 pb-6 px-2 text-2xl" v-if="page && page.guestbookEntries.length > 0">
    <h1 class="font-bold text-4xl sm:text-6xl lg:text-9xl">{{ page.guestbookEntries[0].title }}</h1>
    <p>{{ page.guestbookEntries[0].pageSubheading }}</p>
  </header>
  <section v-if="page && page.guestbookEntries.length > 0">
    <div class="container mx-auto py-12 px-2 text-balance">
      {{ page.guestbookEntries[0].pageContent }}
    </div>
    <div class="container mx-auto px-2 sm:grid gap-6 grid-cols-2">
      <section class="mb-12">
        <!-- Check if there are any posts to display -->
        <ol v-if="paginatedPosts.length > 0" class="mb-2 divide-y divide-slate-300">
          <!-- Loop through the paginated posts and display each one -->
          <li v-for="post in paginatedPosts" :key="post.id">
            <article class="text-xl py-6">
              {{ post.textBlock }}
              <p class="text-sm mt-1">
                <time :datetime="post.postDate">{{ post.postDate }}</time>
              </p>
            </article>
          </li>
        </ol>
        <!-- Message to display if there are no posts -->
        <p v-else class="text-2xl">No entries yet. Create one using the form.</p>
        <Pagination :currentPage="currentPage" :totalPages="totalPages" @update:currentPage="updateCurrentPage" />
      </section>
    </div>
  </section>
  <p v-else-if="loading" class="container mx-auto py-12 px-2 text-2xl">Loading...</p>
  <p v-else class="container mx-auto py-12 px-2 text-2xl">Page data not found.</p>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import Pagination from '~/components/pagination.vue';

// Define the type for GuestbookQuery
interface GuestbookQuery {
  guestbookEntries: Array<{
    title: string;
    pageSubheading: string;
    pageContent: string;
  }>;
  postsEntries: Array<{
    id: string;
    textBlock: string;
    postDate: string;
    draftCreator?: {
      name: string;
    };
  }>;
  totalPosts: number; // Add totalPosts to the query result
}

const currentPage = ref(1);
const itemsPerPage = ref(5);
const page = ref<GuestbookQuery | null>(null);
const loading = ref(true);
const error = ref(null);

// Function to fetch page data
const fetchPageData = async () => {
  loading.value = true;
  try {
    const result = await useAsyncGql<Ref<GuestbookQuery>>({
      operation: 'GetGuestbook',
      variables: {
        limit: itemsPerPage.value,
        offset: (currentPage.value - 1) * itemsPerPage.value
      }
    });
    console.log('GraphQL Response:', result); // Log the response for debugging
    page.value = result.data.value.guestbook;
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
};

// Initial data fetch
await fetchPageData();

// Compute paginated posts
const paginatedPosts = computed(() => page.value?.postsEntries || []);

// Compute total pages
const totalPages = computed(() => {
  const totalPosts = page.value?.totalPosts || 0;
  return Math.ceil(totalPosts / itemsPerPage.value);
});

// Watch for changes in currentPage and refetch data
watch(currentPage, () => {
  fetchPageData();
});

// Function to update current page
const updateCurrentPage = (newPage: number) => {
  currentPage.value = newPage;
};
</script>