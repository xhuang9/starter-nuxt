<template>
  <div>
    <h1>{{ data.guestbookEntries.title }}</h1>
  </div>
</template>

<script lang="ts" setup>
  const data = await GqlGuestbook();
</script>
