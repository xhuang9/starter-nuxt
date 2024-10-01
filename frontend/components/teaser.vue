<template>
  <article class="py-6">
    <h2 class="text-4xl font-bold">
      <a :href="'/article/' + slug" class="text-red-600 hover:underline focus:underline cursor-pointer">{{ title }}</a>
    </h2>
    <p>{{ pageSubheading }}</p>
    <p>
      <time class="text-sm" :datetime="postDate">{{ postDate }}</time>
    </p>
  </article>
</template>

<script setup>
const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  pageSubheading: {
    type: String,
    required: true
  },
  postDate: {
    type: String,
    required: true
  }
});
</script>
