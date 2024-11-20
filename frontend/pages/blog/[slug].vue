<script setup>
import { useRoute } from '#app'
import { useGraphQL } from '@/composables/useGraphQL'
import { usePreview } from '@/composables/usePreview'
import { BLOG_POSTS_QUERY } from '@/queries/blogPosts.mjs'
import { watch, computed } from 'vue'
import { useHead } from '#imports'

const route = useRoute()
const graphql = useGraphQL()
const { isPreview, previewToken, previewTimestamp } = usePreview()

// Disable SSR for preview mode
if (isPreview.value) {
  definePageMeta({ ssr: false })
}

const fetchPost = async () => {
  try {
    const result = await graphql.query(BLOG_POSTS_QUERY, {
      slug: route.params.slug
    }, {
      previewToken: previewToken.value
    })
    
    if (!result?.blogPostsEntries?.length) {
      throw new Error('Post not found')
    }
    
    return result
  } catch (err) {
    console.error('Error fetching post:', err)
    throw err
  }
}

const asyncData = useLazyAsyncData(
  `post-${route.params.slug}`,
  () => fetchPost(),
  {
    default: () => ({ blogPostsEntries: [] })
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
const currentPost = computed(() => {
  const entry = data.value?.blogPostsEntries?.[0]
  console.log('Full entry data:', entry)
  console.log('Next/Prev:', {
    next: entry?.next,
    prev: entry?.prev,
    postDate: entry?.postDate
  })
  return entry
})
const hasPost = computed(() => !!currentPost.value)

// Set the page title
useHead(() => ({
  title: currentPost.value?.title || ''
}))
</script>

<template>
  <div :key="previewTimestamp">
    <div v-if="asyncData.status === 'pending'" class="container mx-auto py-12 px-2">
      Loading...
    </div>
    
    <div v-else-if="error" class="container mx-auto py-12 px-2 text-red-600">
      {{ error.message }}
    </div>
    
    <template v-else-if="hasPost">
      <header class="container mx-auto pt-12 pb-6 px-2 text-2xl">
        <figure v-if="currentPost.image">
          <img :src="currentPost.image.url" :alt="currentPost.image.description" />
        </figure>
        <h1 class="font-bold text-4xl sm:text-6xl lg:text-9xl">{{ currentPost.title }}</h1>
        <p v-if="currentPost.pageSubheading">{{ currentPost.pageSubheading }}</p>
        <div class="text-xs mt-4">
          <p>
            <span v-if="currentPost.category?.length" class="font-bold">
              {{ currentPost.category[0].title }}
            </span>
            <template v-if="currentPost.category?.length && currentPost.postDate">
              |
            </template>
            <time v-if="currentPost.postDate" :datetime="currentPost.postDate">
              {{ currentPost.postDate }}
            </time>
          </p>
        </div>
      </header>

      <section class="page__content">
        <div 
          class="container mx-auto py-12 px-2 text-balance" 
          v-html="currentPost.pageContent"
        ></div>
      </section>

      <section class="container mx-auto mb-6 px-2 divide-y divide-slate-300">
        <Teaser 
          v-if="currentPost.prev"
          :key="currentPost.prev.id"
          :id="currentPost.prev.id"
          :title="currentPost.prev.title"
          :uri="currentPost.prev.uri"
          :pageSubheading="currentPost.prev.pageSubheading"
          :postDate="currentPost.prev.postDate"
        />
        <Teaser
          v-if="currentPost.next"
          :key="currentPost.next.id"
          :id="currentPost.next.id"
          :title="currentPost.next.title"
          :uri="currentPost.next.uri"
          :pageSubheading="currentPost.next.pageSubheading"
          :postDate="currentPost.next.postDate"
        />
      </section>
    </template>

    <div v-else class="container mx-auto py-12 px-2">
      Post not found
    </div>
  </div>
</template>