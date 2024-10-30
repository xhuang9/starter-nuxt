<script setup>
import { watch, onMounted, computed } from 'vue'
import { useRoute } from '#app'
import { usePaginatedData } from '@/composables/usePaginatedData'
import { useGraphQL } from '@/composables/useGraphQL'
import { usePreview } from '@/composables/usePreview'
import { BLOG_QUERY } from '@/queries/blog.mjs'

const route = useRoute()
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
    
    console.log('Raw GraphQL result:', result)
    
    return {
      content: result?.blogEntries?.[0] || {},
      posts: result?.articleEntries || [],
      total: result?.entryCount || 0
    }
  } catch (error) {
    console.error('Error fetching blog data:', error)
    throw error
  }
}

const {
  currentPage,
  data,
  totalPages,
  loading,
  error,
  updateCurrentPage,
  fetchPageData
} = usePaginatedData(fetchBlogData)

// Watch for preview changes
watch([isPreview, previewToken], () => {
  if (isPreview.value && previewToken.value) {
    fetchPageData(currentPage.value)
  }
})

const posts = computed(() => data.value?.posts || [])
const content = computed(() => data.value?.content || {})
</script>

<template>
  <div :key="previewTimestamp">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
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