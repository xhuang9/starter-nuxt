<script setup>
import { useGraphQL } from '~/composables/useGraphQL'
import { PAGE_QUERY } from '~/queries/pages.mjs'
import { usePreview } from '@/composables/usePreview'
import { useHead } from '#imports'

const route = useRoute()
const graphql = useGraphQL()
const { isPreview, previewToken, previewTimestamp } = usePreview()

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

// Get the current slug from the route
const slug = computed(() => {
  const slugParam = route.params.slug
  if (!slugParam) return ''
  return Array.isArray(slugParam) ? slugParam.join('/') : slugParam
})

// Fetch the page data
const { data: pageData, refresh } = await useAsyncData(
  `page-${slug.value}`,
  async () => {
    try {
      const result = await graphql.query(PAGE_QUERY, {
        uri: slug.value
      }, {
        previewToken: previewToken.value
      })
      
      if (!result?.entry) {
        throw createError({ 
          statusCode: 404, 
          message: 'Page not found' 
        })
      }
      
      return result.entry
    } catch (err) {
      console.error('Error fetching page:', err)
      throw createError({ 
        statusCode: 404,
        message: 'Page not found'
      })
    }
  },
  {
    watch: [slug, previewToken] // Watch both slug and preview token
  }
)

// Watch for preview changes and refresh data
watch([isPreview, previewToken], () => {
  if (isPreview.value && previewToken.value) {
    refresh()
  }
})

// Set the page title
useHead(() => ({
  title: pageData.value?.title || ''
}))
</script>

<template>
  <div v-if="pageData" :key="previewTimestamp">
    <header class="container mx-auto pt-12 pb-6 px-2 text-2xl">
      <h1 class="font-bold text-4xl sm:text-6xl lg:text-9xl">
        {{ pageData.title }}
      </h1> 
      <p v-if="pageData.pageSubheading" class="mt-4">
        {{ pageData.pageSubheading }}
      </p>
    </header>
    <section class="page__content">
      <div 
        class="container mx-auto py-12 px-2 text-balance" 
        v-html="pageData.pageContent"
      />
    </section>
  </div>
</template>