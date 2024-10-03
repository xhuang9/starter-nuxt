<script setup>
import { ref } from 'vue'

const form = ref({
  message: ''
})

const submitting = ref(false)
const title = ref('Post ' + now())

const submitPost = async () => {
  submitting.value = true
  try {
    const result = await createPost({
      title: title.value,
      message: form.value.message
    })
    console.log('Post created:', result)
    // Reset form or navigate to new post
    form.value = { message: '' }
  } catch (error) {
    console.error('Error creating post:', error)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form method="post" @submit.prevent="submitPost">
    <div class="mb-6 mt-4">
      <label for="message" class="font-bold">Message</label>
      <textarea name="message" class="w-full px-6 py-4" required id="message" v-model="message"></textarea>
    </div>
    <input type="submit" class="rounded font-bold bg-red-600 text-slate-50 px-6 py-4" value="Post entry" />
  </form>  
</template>
