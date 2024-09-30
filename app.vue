<script lang="js" setup>
  import { ref } from 'vue';

  const globalData = ref({
    siteName: 'Nuxt Starter',
    address: {
      title: 'Nuxt Starter',
      addressLine1: '123 Address St.',
      addressLine2: null,
      addressLine3: null,
      locality: 'City',
      postalCode: 'POSTAL',
      countryCode: 'Country'
    }
  })
</script>

<template>
  <div>
    <Header :globalData="globalData" />
    <NuxtPage />
    <Footer :globalData="globalData" />
  </div>
</template>
