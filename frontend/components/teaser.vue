<script setup>
const props = defineProps({
  entry: {
    type: Object,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <article class="py-6 mb-12">
    <figure 
      v-if="entry.image && entry.image.length > 0"   
      :class="featured ? '' : 'sm:w-1/3'"
    >
      <NuxtLink
        :to="`/${entry.uri}`" 
        class="text-red-600 hover:underline focus:underline cursor-pointer block mb-4"
      >
        <img 
          :src="entry.image[0].url" 
          :alt="entry.image[0].alt" 
          width="990" 
          height="540"
        />
      </NuxtLink>
    </figure>
    <div class="mb-4"å>
      <h2 class="font-bold mb-2" :class="featured ? 'text-6xl' : 'text-4xl'">
        <NuxtLink 
          :to="`/${entry.uri}`" 
          class="text-red-600 hover:underline focus:underline cursor-pointer"
        >
          {{ entry.title }}
        </NuxtLink>
      </h2>
      <p v-if="entry.pageSubheading">{{ entry.pageSubheading }}</p>
      <p>
        <time class="text-sm" :datetime="entry.postDate">{{ entry.postDate }}</time>
      </p>
    </div>
  </article>
</template>
