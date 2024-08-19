<template>
  <div>
    <h1>{{ data.entry.title }}</h1>
    <div>{{ data }}</div>
  </div>
</template>

<script lang="ts" setup>
  const data = await GqlHome();
</script>
