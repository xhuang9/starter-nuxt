<script setup>
const props = defineProps({
  globalData: {
    type: Object,
    default: () => ({
      title: ''
    })
  },
  pages: {
    type: Array,
    default: () => []
  }
})

// Get the site name from the global entry
const siteName = computed(() => process.env.SITE_NAME)
</script>

<template>
  <header class="navigation py-6 px-2 bg-slate-50">
    <div class="sm:flex justify-between container items-center mx-auto">
      <div class="logo sm:tw-basis-1/3 font-bold p-1">
        <Logo :siteName="siteName" />
      </div>
      <div>
        <Navigation :pages="pages" />
      </div>
    </div>
  </header>
</template>
