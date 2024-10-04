<script setup>
import { ref } from 'vue'
import { useLazyAsyncData, useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()
const message = ref('')
const title = ref('Post ')

const fetchCsrfToken = async () => {
  try {
    const response = await fetch(`${config.public.baseURL}/api/csrf`)
    const data = await response.json()
    return data.csrfToken
  } catch (error) {
    console.error('Error fetching CSRF token:', error)
    return null
  }
}

const { data: csrfToken } = useLazyAsyncData('csrfToken', fetchCsrfToken)

// Use the auto-generated composable for the createPost mutation
const { mutate: createPost, loading, error } = useCreatePostMutation()

const submitPost = async () => {
  if (!csrfToken.value) {
    console.error('CSRF token not available')
    return
  }

  try {
    const result = await createPost({
      title: title.value,
      message: message.value
    }, {
      headers: {
        'X-CSRF-Token': csrfToken.value,
      }
    })
    console.log('Post created:', result)
    // Clear the form fields after successful submission
    title.value = 'Post '
    message.value = ''
  } catch (err) {
    console.error('Error creating post:', err)
  }
}
</script>

<template>
  <form method="post" @submit.prevent="submitPost">
    <div class="mb-6 mt-4">
      <label for="title" class="font-bold">Title</label>
      <input type="text" name="title" class="w-full px-6 py-4" required id="title" v-model="title">
    </div>
    <div class="mb-6 mt-4">
      <label for="message" class="font-bold">Message</label>
      <textarea name="message" class="w-full px-6 py-4" required id="message" v-model="message"></textarea>
    </div>
    <input type="submit" class="rounded font-bold bg-red-600 text-slate-50 px-6 py-4" value="Post entry" :disabled="loading">
  </form>
</template>
