<script setup>
import { usePreview } from '@/composables/usePreview'
import { useGraphQL } from '@/composables/useGraphQL'
import { HOME_QUERY } from '@/queries/home.mjs'
import { ref } from 'vue'
import { watch } from '#imports'

const { isPreview, previewToken, previewTimestamp } = usePreview()
const graphql = useGraphQL()
const data = ref(null)

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

// Fetch data function
const fetchData = async () => {
  try {
    const result = await graphql.query(HOME_QUERY, {}, {
      previewToken: previewToken.value
    })
    data.value = result
  } catch (error) {
    console.error('Failed to fetch home data:', error)
  }
}

// Initial fetch
await fetchData()

// Watch for preview changes and refresh data
watch([isPreview, previewToken], () => {
  if (isPreview.value && previewToken.value) {
    fetchData()
  }
}, { immediate: true })
</script>

<template>
  <div :key="previewTimestamp">
    <header class="container mx-auto pt-12 pb-6 px-2 text-2xl">
      <h1 class="font-bold text-4xl sm:text-6xl lg:text-9xl">
        {{ data?.entries?.[0]?.title }}
      </h1>
      <p v-if="data?.entries?.[0]?.pageSubheading">
        {{ data?.entries?.[0]?.pageSubheading }}
      </p>
    </header>
    <section class="page__content">
      <div 
        class="container mx-auto py-12 px-2 text-balance" 
        v-html="data?.entries?.[0]?.pageContent"
      ></div>
    </section>
  </div>
</template>
