<template>
  <header class="navigation py-6 px-2 bg-slate-50">
    <div class="sm:flex justify-between container items-center mx-auto">
      <div class="logo sm:tw-basis-1/3 font-bold p-1">
        <Logo />
      </div>
      <div>
        <Navigation />
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
  const global = await GqlGlobals();
</script>