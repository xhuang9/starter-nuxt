<script setup>
import { useGraphQL } from '~/composables/useGraphQL'
import { PAGE_QUERY } from '~/queries/pages.mjs'

const route = useRoute()
const graphql = useGraphQL()

// Get the current slug from the route
const slug = computed(() => {
  const slugParam = route.params.slug
  if (!slugParam) return ''
  return Array.isArray(slugParam) ? slugParam.join('/') : slugParam
})
// Get preview token if it exists
const token = route.query.token

// Fetch the page data
const { data: pageData } = await useAsyncData(
  `page-${slug.value}`,
  async () => {
    try {
      const result = await graphql.query(PAGE_QUERY, {
        uri: slug.value,
        token
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
    watch: [slug]
  }
)

// Set meta tags
useHead(() => ({
  title: pageData.value?.seo?.title || pageData.value?.title,
  meta: [
    {
      name: 'description',
      content: pageData.value?.seo?.description
    }
  ]
}))
</script>

<template>
  <div :key="previewTimestamp">
    <header class="container mx-auto pt-12 pb-6 px-2 text-2xl">
      <h1 class="font-bold text-4xl sm:text-6xl lg:text-9xl">
        {{ pageData.title }}
      </h1> 
      <p v-if="pageData.pageSubheading">
        {{ pageData.pageSubheading }}
      </p>
    </header>
    <section class="page__content">
      <div 
        class="container mx-auto py-12 px-2 text-balance" 
        v-html="pageData.pageContent"
      ></div>
    </section>
  </div>
</template>
