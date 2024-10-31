<script setup>
import { useGraphQL } from '@/composables/useGraphQL'
import { usePreview } from '@/composables/usePreview'
import { usePaginatedData } from '@/composables/usePaginatedData'
import { GUESTBOOK_QUERY } from '@/queries/guestbook.mjs'
import { computed } from 'vue'
import { useHead } from '#imports'

const graphql = useGraphQL()
const { isPreview, previewToken } = usePreview()

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

const fetchGuestbookData = async (page, perPage) => {
  try {
    console.log('Fetching with params:', { page, perPage })
    
    const result = await graphql.query(GUESTBOOK_QUERY, {
      limit: perPage,
      offset: (page - 1) * perPage
    }, {
      previewToken: previewToken.value
    })
    
    console.log('Raw GraphQL Response:', result)
    
    const processedData = {
      content: result?.guestbookEntries?.[0] || {},
      posts: result?.postsEntries || [],
      total: result?.entryCount || 0
    }
    
    console.log('Processed Data:', processedData)
    
    return processedData
  } catch (err) {
    console.error('GraphQL Error:', err)
    throw err
  }
}

const {
  currentPage,
  data,
  totalPages,
  error,
  loading,
  updateCurrentPage,
  fetchPageData
} = usePaginatedData(fetchGuestbookData)

onMounted(() => {
  fetchPageData(1)
})

watch(data, (newData) => {
  console.log('Watch Data:', newData)
}, { immediate: true })

const content = computed(() => data.value?.content || {})
const posts = computed(() => data.value?.posts || [])

const handleNewPost = async () => {
  if (currentPage.value === 1) {
    // Just refresh the current page
    await fetchGuestbookData(1, 3)
  } else {
    // Go back to page 1
    updateCurrentPage(1)
  }
}

// Set the page title
useHead(() => ({
  title: content.value.title || ''
}))
</script>

<template>
  <div>
    <div v-if="loading" class="container mx-auto py-12 px-2">
      Loading...
    </div>
    
    <div v-else-if="error" class="container mx-auto py-12 px-2 text-red-600">
      {{ error.message }}
    </div>
    
    <template v-else>
      <header class="container mx-auto pt-12 pb-6 px-2 text-2xl">
        <h1 class="font-bold text-4xl sm:text-6xl lg:text-9xl">{{ content.title }}</h1>
        <p v-if="content.pageSubheading">{{ content.pageSubheading }}</p>
      </header>

      <section class="page__content">
        <div 
          class="container mx-auto py-12 px-2 text-balance" 
          v-html="content.pageContent"
        ></div>
      </section>

      <div class="container mx-auto px-2 sm:grid gap-6 grid-cols-2">
        <section class="mb-12">
          <div v-if="posts.length > 0">
            <ol class="mb-2 divide-y divide-slate-300">
              <li v-for="post in posts" :key="post.id">
                <article class="text-xl py-6">
                  <div v-html="post.textBlock"></div>
                  <p class="text-sm mt-1">
                    <time :datetime="post.postDate">{{ post.postDate }}</time>
                  </p>
                </article>
              </li>
            </ol>
            <Pagination
              v-if="totalPages > 1"
              :currentPage="currentPage"
              :totalPages="totalPages"
              @update:currentPage="updateCurrentPage"
            />
          </div>
          <p v-else class="text-2xl">No entries yet. Create one using the form.</p>
        </section>

        <section>
          <div class="bg-slate-200 p-6 mb-9 rounded">
            <h2 class="font-bold text-3xl mb-4">Post an entry</h2>
            <PostForm @post-submitted="handleNewPost" />
          </div>
        </section>
      </div>
    </template>
  </div>
</template>