<script setup>
const props = defineProps({
  siteName: {
    type: String,
    required: true
  }
});
</script>

<template>
  <a href="/" class="text-red-600 block">
    {{ siteName }}
  </a>
</template>
