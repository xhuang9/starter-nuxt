<template>
  <form method="post">
    <div class="mb-6 mt-4">
      <label for="post" class="font-bold">Message</label>
      <textarea name="fields[textBlock]" class="w-full px-6 py-4" required id="message"></textarea>
    </div>
    <input type="submit" class="rounded font-bold bg-red-600 text-slate-50 px-6 py-4" value="Post entry" />
  </form>  
</template>
