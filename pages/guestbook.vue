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
                <time :datetime="post.postDate">{{ post.postDate }}</time><br />
                By {{ post.draftCreator ? post.draftCreator.name : 'Unknown Author' }}
              </p>
            </article>
          </li>
        </ol>
        <!-- Message to display if there are no posts -->
        <p v-else class="text-2xl">No entries yet. Create one using the form.</p>
        <!-- Pagination controls -->
        <nav class="pt-6 text-sm" role="navigation" aria-label="Entry pagination">
          <ul class="flex justify-between">
            <li>
              <!-- Button to go to the previous page -->
              <button @click="prevPage" :disabled="currentPage === 1" aria-label="Previous Page" class="text-red-600 cursor-pointer font-bold hover:underline focus:underline">
                ← Previous
              </button>
            </li>
            <li>
              <!-- Display the current page and total pages -->
              <span>Page {{ currentPage }} of {{ totalPages }}</span>
            </li>
            <li>
              <!-- Button to go to the next page -->
              <button @click="nextPage" :disabled="currentPage === totalPages" aria-label="Next Page" class="text-red-600 cursor-pointer font-bold hover:underline focus:underline">
                Next →
              </button>
            </li>
          </ul>
        </nav>
      </section>
    </div>
  </section>
  <p v-else-if="loading" class="container mx-auto py-12 px-2 text-2xl">Loading...</p>
  <p v-else class="container mx-auto py-12 px-2 text-2xl">Page data not found.</p>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useAsyncData } from '#app';

// Define interfaces for the data
interface GuestbookEntry {
  title: string;
  pageSubheading: string;
  pageContent: string;
}

interface PostEntry {
  id: string;
  textBlock: string;
  postDate: string;
  draftCreator?: {
    name: string;
  };
}

interface PageData {
  guestbookEntries: GuestbookEntry[];
  postsEntries: PostEntry[];
}

// Define the current page and items per page
const currentPage = ref(1);
const itemsPerPage = 5;

// Fetch the guestbook data using useAsyncData
const { data: page, pending: loading } = useAsyncData<PageData>('guestbook', async () => {
  const response: GuestbookQuery = await GqlGuestbook();
  return {
    guestbookEntries: response.guestbookEntries.map((entry: GuestbookEntry) => ({
      title: entry.title,
      pageSubheading: entry.pageSubheading,
      pageContent: entry.pageContent,
    })),
    postsEntries: response.postsEntries.map((post: PostEntry) => ({
      id: post.id,
      textBlock: post.textBlock,
      postDate: post.postDate,
      draftCreator: post.draftCreator,
    }))
  };
});

// Compute the total number of pages based on the number of posts
const totalPages = computed(() => {
  return page.value ? Math.ceil(page.value.postsEntries.length / itemsPerPage) : 1;
});

// Compute the posts to display on the current page
const paginatedPosts = computed(() => {
  if (!page.value) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return page.value.postsEntries.slice(start, end);
});

// Function to go to the previous page
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// Function to go to the next page
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
</script>