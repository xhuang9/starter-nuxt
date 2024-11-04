<script setup>
defineProps({
  pages: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <nav class="sm:tw-basis-2/3 grow-1" aria-label="Primary">
    <ul class="sm:flex">
      <li>
        <NuxtLink 
          to="/blog" 
          class="block p-2 hover:underline text-red-600 hover:text-red-600"
          active-class="text-red-600"
          :aria-current="$route.path === '/blog' ? 'page' : null"
        >
          Blog
        </NuxtLink>
      </li>
      <li>
        <NuxtLink 
          to="/guestbook" 
          class="block p-2 hover:underline text-red-600 hover:text-red-600"
          active-class="text-red-600"
          :aria-current="$route.path === '/guestbook' ? 'page' : null"
        >
          Guestbook
        </NuxtLink>
      </li>
      <li v-for="page in pages" :key="page.id">
        <NuxtLink 
          :to="page.uri" 
          class="block p-2 hover:underline text-red-600 hover:text-red-600"
          active-class="text-red-600"
          :aria-current="$route.path === page.uri ? 'page' : null"
        >
          {{ page.title }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>