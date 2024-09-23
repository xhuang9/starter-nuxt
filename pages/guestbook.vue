<template>
  <header class="container mx-auto pt-12 pb-6 px-2 text-2xl">
    <h1 class="font-bold text-4xl sm:text-6xl lg:text-9xl">{{ data.guestbookEntries?.[0]?.title }}</h1>
    <p v-if="data.guestbookEntries?.[0]?.pageSubheading">{{ data.guestbookEntries?.[0]?.pageSubheading }}</p>
  </header>
  <section class="page__content">
    <div class="container mx-auto py-12 px-2 text-balance" v-html="data.guestbookEntries?.[0]?.pageContent"></div>
  </section>
  <div class="container mx-auto px-2 sm:grid gap-6 grid-cols-2">
    <section class="mb-12">
      <ol class="mb-2 divide-y divide-slate-300" v-if="data.postsEntries.length > 0">
        <li v-for="post in data.postsEntries">
          <article class="text-xl py-6">
            {{ post.textBlock }}
            <p class="text-sm mt-1">
              <time :datetime="post.postDate">{{ post.postDate }}</time><br />
              By
            </p>
          </article>
        </li>
      </ol>
      <p class="text-2xl" v-else>No entries yet. Create one using the form.</p>
    </section>
    <section>
      <div class="bg-slate-200 p-6 mb-9 rounded">
        <h2 class="font-bold text-3xl mb-4">Post an entry</h2>
        <PostForm />
        <SignInForm />
      </div>
    </section>
  </div>
</template>

<script lang="js" setup>
  const { data } = await useAsyncGql({
    operation: 'Guestbook',
    variables: { 
      limit: 3,
      offset: 0 
    }
  });

</script>
