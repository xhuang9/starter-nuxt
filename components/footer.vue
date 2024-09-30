<script lang="js" setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    globalData: {
      type: Object,
      required: false
    }
  })
</script>


<template>
  <footer class="bg-slate-50 py-6 px-2 text-sm">
    <address class="container mx-auto not-italic" v-if="globalData.address">
      <p class="font-bold">{{ globalData.address.title }}</p>
      <p>
        {{ globalData.address.addressLine1 }}<br v-if="globalData.address.addressLine1" />
        {{ globalData.address.addressLine2 }}<br v-if="globalData.address.addressLine2" />
        {{ globalData.address.addressLine3 }}<br v-if="globalData.address.addressLine3" />
        {{ globalData.address.locality }} {{ globalData.address.postalCode }}<br />
        {{ globalData.address.countryCode }}
      </p>
    </address>
  </footer>
</template>
