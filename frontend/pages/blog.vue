<script setup>
import { watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from '#app'
import { usePaginatedData } from '@/composables/usePaginatedData'
import { useGraphQL } from '@/composables/useGraphQL'
import { usePreview } from '@/composables/usePreview'
import { BLOG_QUERY } from '@/queries/blog.mjs'

const route = useRoute()
const router = useRouter()
const graphql = useGraphQL()
const { isPreview, previewToken, previewTimestamp } = usePreview()

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

const fetchBlogData = async (page, perPage) => {
  console.log(`Fetching blog data for page ${page} with ${perPage} items per page`)
  try {
    const result = await graphql.query(BLOG_QUERY, {
      limit: perPage,
      offset: (page - 1) * perPage
    }, {
      previewToken: previewToken.value
    })
    
    console.log('Raw GraphQL result:', JSON.stringify(result, null, 2))
    
    if (!result) {
      throw new Error('No result returned from GraphQL query')
    }
    
    if (!result.articleEntries) {
      console.error('Missing articleEntries in GraphQL response:', result)
      throw new Error('Invalid GraphQL response: missing postsEntries')
    }
    
    return {
      articleEntries: result.articleEntries,
      blogEntries: result.blogEntries || [],
      entryCount: result.entryCount || 0
    }
  } catch (error) {
    console.error('Error fetching blog data:', error)
    throw error
  }
}

const {
  currentPage,
  itemsPerPage,
  data,
  totalPages,
  loading,
  error,
  updateCurrentPage,
  fetchPageData
} = usePaginatedData(fetchBlogData, router)

// Watch for changes in the route's query parameters
watch(
  () => route.query,
  (newQuery) => {
    const newPage = parseInt(newQuery.page) || 1
    if (newPage !== currentPage.value) {
      currentPage.value = newPage
    }
  }
)

// Watch for preview changes
watch([isPreview, previewToken], () => {
  if (isPreview.value && previewToken.value) {
    fetchPageData(currentPage.value)
  }
})

onMounted(() => {
  const pageFromQuery = parseInt(route.query.page) || 1
  currentPage.value = pageFromQuery
  fetchPageData(currentPage.value)
})

const posts = computed(() => data.value?.articleEntries || [])
const content = computed(() => data.value?.blogEntries?.[0] || { title: '', pageSubheading: '', pageContent: '' })
</script>

<template>
  <div :key="previewTimestamp">
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
  </div>
</template>