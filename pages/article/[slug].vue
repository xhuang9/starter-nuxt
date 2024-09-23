<template>
  <header class="container mx-auto pt-12 pb-6 px-2 text-2xl">
    <h1 class="font-bold text-4xl sm:text-6xl lg:text-9xl">{{ data.articleEntries?.[0]?.title }}</h1>
    <p v-if="data.articleEntries?.[0]?.pageSubheading">{{ data.articleEntries?.[0]?.pageSubheading }}</p>
    <div class="text-xs mt-4">
      <p><span class="font-bold" v-if="data.articleEntries?.[0]?.category">{{ data.articleEntries?.[0]?.category?.[0]?.title }}</span> | <time datetime="{{ data.articleEntries?.[0]?.postDate }}">{{ data.articleEntries?.[0]?.postDate }}</time></p>
      <p class="text-xs">By </p>
    </div>
  </header>
  <section class="page__content">
    <div class="container mx-auto py-12 px-2 text-balance" v-html="data.articleEntries?.[0]?.pageContent"></div>
  </section>
  <section class="container mx-auto mb-6 px-2 divide-y divide-slate-300">
    <Teaser
    v-if="data.articleEntries?.[0]?.prev"
    :id="data.articleEntries?.[0]?.prev?.[0]?.id"
    :title="data.articleEntries?.[0]?.prev?.[0]?.title"
    :slug="data.articleEntries?.[0]?.prev?.[0]?.slug"
    :pageSubheading="data.articleEntries?.[0]?.prev?.[0]?.pageSubheading"
    :postDate="data.articleEntries?.[0]?.prev?.[0]?.postDate" />
    <Teaser
    v-if="data.articleEntries?.[0]?.next"
    :id="data.articleEntries?.[0]?.next?.[0]?.id"
    :title="data.articleEntries?.[0]?.next?.[0]?.title"
    :slug="data.articleEntries?.[0]?.next?.[0]?.slug"
    :pageSubheading="data.articleEntries?.[0]?.next?.[0]?.pageSubheading"
    :postDate="data.articleEntries?.[0]?.next?.[0]?.postDate" />
  </section>
</template>

<script lang="js" setup>
  const route = useRoute()
  const { data } = await useAsyncGql({
    operation: 'Article',
    variables: { 
      slug: route.params.slug
    }
  });
</script>
