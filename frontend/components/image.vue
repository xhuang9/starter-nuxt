<script setup>
const props = defineProps({
  image: {
    type: String,
    required: true
  }
})
}

const getPhotoUrl = (photo, width) => {
  return `${photo.url}?width=${width}`
}
</script>

<template>
  <picture>
    <source data-sizes="100vw" />
    <img 
      :src="image.url"
      :srcset="image.srcset"
      :alt="image.alt"
      sizes="100vw"
    />
  </picture>
</template>