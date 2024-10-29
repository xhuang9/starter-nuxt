<script setup>
import { useRoute } from '#app'
import { useGraphQL } from '@/composables/useGraphQL'
import { usePreview } from '@/composables/usePreview'
import { ARTICLE_QUERY } from '@/queries/article.mjs'
import { watch, computed } from 'vue'

const route = useRoute()
const graphql = useGraphQL()
const { isPreview, previewToken, previewTimestamp } = usePreview()

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

const fetchArticle = async () => {
  try {
    const result = await graphql.query(ARTICLE_QUERY, {
      slug: route.params.slug
    }, {
      previewToken: previewToken.value
    })
    
    if (!result?.articleEntries?.length) {
      throw new Error('Article not found')
    }
    
    return result
  } catch (err) {
    console.error('Error fetching article:', err)
    throw err
  }
}

const asyncData = useLazyAsyncData(
  `article-${route.params.slug}`,
  () => fetchArticle(),
  {
    default: () => ({ articleEntries: [] })
  }
)

const { data, error, refresh } = asyncData

// Watch for preview changes
watch([isPreview, previewToken], () => {
  if (isPreview.value && previewToken.value) {
    refresh()
  }
})

// Computed property for cleaner template
const article = computed(() => {
  const entry = data.value?.articleEntries?.[0]
  console.log('Full entry data:', entry)
  console.log('Next/Prev:', {
    next: entry?.next,
    prev: entry?.prev,
    postDate: entry?.postDate
  })
  return entry
})
const hasArticle = computed(() => !!article.value)


</script>

<template>
  <div :key="previewTimestamp">
    <div v-if="asyncData.status === 'pending'" class="container mx-auto py-12 px-2">
      Loading...
    </div>
    
    <div v-else-if="error" class="container mx-auto py-12 px-2 text-red-600">
      {{ error.message }}
    </div>
    
    <template v-else-if="hasArticle">
      <header class="container mx-auto pt-12 pb-6 px-2 text-2xl">
        <h1 class="font-bold text-4xl sm:text-6xl lg:text-9xl">{{ article.title }}</h1>
        <p v-if="article.pageSubheading">{{ article.pageSubheading }}</p>
        <div class="text-xs mt-4">
          <p>
            <span v-if="article.category?.length" class="font-bold">
              {{ article.category[0].title }}
            </span>
            <template v-if="article.category?.length && article.postDate">
              |
            </template>
            <time v-if="article.postDate" :datetime="article.postDate">
              {{ article.postDate }}
            </time>
          </p>
        </div>
      </header>

      <section class="page__content">
        <div 
          class="container mx-auto py-12 px-2 text-balance" 
          v-html="article.pageContent"
        ></div>
      </section>

      <section class="container mx-auto mb-6 px-2 divide-y divide-slate-300">
        <Teaser 
          v-if="article.prev"
          v-bind="article.prev"
          :key="article.prev.id"
          :id="article.prev.id"
          :title="article.prev.title"
          :slug="article.prev.slug"
          :pageSubheading="article.prev.pageSubheading"
          :postDate="article.prev.postDate"
        />
        <Teaser
          v-if="article.next"
          v-bind="article.next"
          :key="article.next.id"
          :id="article.next.id"
          :title="article.next.title"
          :slug="article.next.slug"
          :pageSubheading="article.next.pageSubheading"
          :postDate="article.next.postDate"
        />
      </section>
    </template>

    <div v-else class="container mx-auto py-12 px-2">
      Article not found
    </div>
  </div>
</template>