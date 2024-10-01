<script lang="js" setup>
  const { data } = await useAsyncGql({
    operation: 'Home'
  });
</script>

<template>
  <header class="container mx-auto pt-12 pb-6 px-2 text-2xl">
    <h1 class="font-bold text-4xl sm:text-6xl lg:text-9xl">{{ data.homeEntries?.[0]?.title }}</h1>
    <p v-if="data.homeEntries?.[0]?.pageSubheading">{{ data.homeEntries?.[0]?.pageSubheading }}</p>
  </header>
  <section class="page__content">
    <div class="container mx-auto py-12 px-2 text-balance" v-html="data.homeEntries?.[0]?.pageContent"></div>
  </section>
</template>
