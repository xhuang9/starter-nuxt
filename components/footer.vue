<script lang="js" setup>
  const { data } = await useAsyncGql({
    operation: 'Globals'
  });
</script>


<template>
  <footer class="bg-slate-50 py-6 px-2 text-sm">
    <address class="container mx-auto not-italic">
      <p class="font-bold">{{ data.globalEntries?.[0]?.address?.[0]?.title }}</p>
      <p>
        {{ data.globalEntries?.[0]?.address?.[0]?.addressLine1 }}<br v-if="data.globalEntries?.[0]?.address?.[0]?.addressLine1" />
        {{ data.globalEntries?.[0]?.address?.[0]?.addressLine2 }}<br v-if="data.globalEntries?.[0]?.address?.[0]?.addressLine2" />
        {{ data.globalEntries?.[0]?.address?.[0]?.addressLine3 }}<br v-if="data.globalEntries?.[0]?.address?.[0]?.addressLine3" />
        {{ data.globalEntries?.[0]?.address?.[0]?.locality }} {{ data.globalEntries?.[0]?.address?.[0]?.postalCode }}<br />
        {{ data.globalEntries?.[0]?.address?.[0]?.countryCode }}
      </p>
    </address>
  </footer>
</template>
