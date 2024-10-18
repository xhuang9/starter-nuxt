<script lang="js" setup>
  import { useFlashes } from '~/composables/useFlashes'

  const { flashes } = useFlashes()
  const props = defineProps({
    flashes: {
      type: Array,
      required: false
    }
  })
</script>

<template>
  <div v-if="flashes.length > 0" class="bg-red-600 text-slate-50 text-center">
      <p v-for="flash in flashes" :key="flash.id" :class="flash.level" class="container mx-auto p-2 text-md">
        {{ flash.message }}
      </p>
  </div>
</template>
