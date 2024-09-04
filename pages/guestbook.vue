<template>
  <header class="container mx-auto pt-12 pb-6 px-2 text-2xl">
    <h1 v-if="firstGuestbookEntry" class="font-bold text-4xl sm:text-6xl lg:text-9xl">{{ firstGuestbookEntry.title }}</h1>
    <p v-if="firstGuestbookEntry">{{ firstGuestbookEntry.pageSubheading }}</p>
  </header>
  <section>
    <div v-if="firstGuestbookEntry" class="container mx-auto py-12 px-2 text-balance">
      {{ firstGuestbookEntry.pageContent }}
    </div>
  </section>
  <div class="container mx-auto px-2 sm:grid gap-6 grid-cols-2">
    <section class="mb-12">
      <ol v-if="page.postsEntries.length > 0" class="mb-2 divide-y divide-slate-300">
        <li v-for="post in page.postsEntries" :key="post.id">
          <article class="text-xl py-6">
            {{ post.textBlock }}
            <p class="text-sm mt-1">
              <time :datetime="post.postDate">{{ post.postDate }}</time><br />
              By {{ post.draftCreator ? post.draftCreator.name : 'Unknown Author' }}
            </p>
          </article>
        </li>
      </ol>
      <p v-else class="text-2xl">No entries yet. Create one using the form.</p>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';

const limit = 3;
const currentPage = ref(1);
const totalEntries = ref(0);
const page = ref({ guestbookEntries: [], postsEntries: [] });

const fetchEntries = async () => {
  const offset = (currentPage.value - 1) * limit;
  const response = await GqlGuestbook({ limit, offset });
  page.value = response.guestbookEntries;
  totalEntries.value = response.totalEntries;
};

const firstGuestbookEntry = computed(() => {
  return page.value.guestbookEntries.length > 0 ? page.value.guestbookEntries[0] : null;
});

const totalPages = computed(() => {
  return Math.ceil(totalEntries.value / limit);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchEntries();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchEntries();
  }
};

onMounted(fetchEntries);
</script>
