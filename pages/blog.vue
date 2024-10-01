<script setup>
import { usePaginatedData } from '@/composables/usePaginatedData';

const router = useRouter();

const fetchBlogData = async (currentPage, itemsPerPage) => {
  try {
    console.log('Fetching data for page:', currentPage, 'with itemsPerPage:', itemsPerPage);
    const GqlInstance = useGql();
    const result = await GqlInstance('Blog', {
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage
    });
    console.log('GraphQL result:', result);
    if (!result || !result.articleEntries) {
      console.error('No data returned from GraphQL query');
      return null;
    }
    return result;
  } catch (error) {
    console.error('Error fetching guestbook data:', error);
    return null;
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
} = usePaginatedData(fetchBlogData, router);

// Extract posts from the data
const posts = computed(() => data.value?.articleEntries || []);
const content = computed(() => data.value?.blogEntries[0] || { title: '', pageSubheading: '', pageContent: '' });
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div v-else>
    <header class="container mx-auto pt-12 pb-6 px-2 text-2xl">
      <h1 class="font-bold text-4xl sm:text-6xl lg:text-9xl">{{ content.title }}</h1>
      <p v-if="content.pageSubheading">{{ content.pageSubheading }}</p>
    </header>
    <section class="page__content">
      <div class="container mx-auto py-12 px-2 text-balance" v-html="content.pageContent"></div>
    </section>
    <section class="container mx-auto mb-6 px-2 divide-y divide-slate-300">
      <Teaser 
        v-for="entry in posts" 
        :key="entry.id"
        :id="entry.id"
        :title="entry.title"
        :slug="entry.slug"
        :pageSubheading="entry.pageSubheading"
        :postDate="entry.postDate"
      />
      <Pagination
        v-if="totalPages > 1"
        :currentPage="currentPage"
        :totalPages="totalPages"
        @update:currentPage="updateCurrentPage"
      />
    </section>
  </div>
</template>


