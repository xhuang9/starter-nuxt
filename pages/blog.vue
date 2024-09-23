<template>
  <header class="container mx-auto pt-12 pb-6 px-2 text-2xl">
    <h1 class="font-bold text-4xl sm:text-6xl lg:text-9xl">{{ data.blogEntries?.[0]?.title }}</h1>
    <p v-if="data.blogEntries?.[0]?.pageSubheading">{{ data.blogEntries?.[0]?.pageSubheading }}</p>
  </header>
  <section class="page__content">
    <div class="container mx-auto py-12 px-2 text-balance" v-html="data.blogEntries?.[0]?.pageContent"></div>
  </section>
  <section class="container mx-auto mb-6 px-2 divide-y divide-slate-300">
    <Teaser v-for="(entry, i) in data?.articleEntries" 
    :key="entry?.id"
    :title="entry?.title"
    :slug="entry?.slug"
    :pageSubheading="entry?.pageSubheading"
    :postDate="entry?.postDate" />
  </section>
</template>

<script lang="ts" setup>
  const { data } = await useAsyncGql({
    operation: 'Blog',
    variables: { 
      limit: 3,
      offset: 0 
    }
  });
</script>
