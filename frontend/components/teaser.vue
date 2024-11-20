<script setup>
const props = defineProps({
  id: {
    type: Number,
    required: true,
    default: 0
  },
  title: {
    type: String,
    required: true
  },
  uri: {
    type: String,
    required: true
  },
  pageSubheading: {
    type: String,
    required: false,
    default: ''
  },
  postDate: {
    type: String,
    required: true
  }
});
</script>

<template>
  <article class="py-6">
    <h2 class="text-4xl font-bold">
      <NuxtLink 
        :to="`/${uri}`" 
        class="text-red-600 hover:underline focus:underline cursor-pointer"
      >{{ title }}
    </NuxtLink>
    </h2>
    <p v-if="pageSubheading">{{ pageSubheading }}</p>
    <p>
      <time class="text-sm" :datetime="postDate">{{ postDate }}</time>
    </p>
  </article>
</template>
