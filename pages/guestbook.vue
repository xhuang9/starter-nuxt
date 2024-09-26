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

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const currentPage = ref(1);
const itemsPerPage = ref(3);
const page = ref(null);
const loading = ref(true);
const error = ref(null);

const content = computed(() => {
  return page.value?.guestbookEntries[0] || { title: '', pageSubheading: '', pageContent: '' };
});

const posts = computed(() => page.value?.postsEntries || []);

// Function to fetch page data
const fetchPageData = async () => {
  loading.value = true;
  try {
    const result = await useAsyncGql({
      operation: 'Guestbook',
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

// Fetch on load
onMounted(fetchPageData);

// Calculate total pages
const totalPosts = computed(() => page.value?.entryCount || 0);

const totalPages = computed(() => {
  return Math.ceil(totalPosts / itemsPerPage.value);
});

// Watch for changes in currentPage and refetch data
watch(currentPage, fetchPageData);

// Function to update current page
const updateCurrentPage = (newPage) => {
  currentPage.value = newPage;
};
</script>
