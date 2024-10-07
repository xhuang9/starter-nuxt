<script setup>
import { ref } from 'vue'
import { useLazyAsyncData, useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()
const message = ref('')
const title = ref('Post ')
const loading = ref(false)

const fetchCsrfToken = async () => {
  try {
    const response = await fetch('/api/csrf')
    const data = await response.json()
    return data.csrfToken
    console('CSRF acquired ' + data.csrfToken)
  } catch (error) {
    console.error('Error fetching CSRF token:', error)
    return null
  }
}

const { data: csrfTokenData, error: csrfError } = await useFetch('/api/csrf')
const csrfToken = ref(csrfTokenData.value?.csrfToken)

if (csrfError.value) {
  console.error('Error fetching CSRF token:', csrfError.value)
}

const submitPost = async () => {
  if (!csrfToken.value) {
    console.error('CSRF token not available')
    return
  }

  loading.value = true
  try {
    console.log('Submitting post with title:', title.value, 'and message:', message.value)
    console.log('CSRF Token:', csrfToken.value)

    const result = await GqlCreatePost({
      title: title.value,
      message: message.value
    }, {
      headers: {
        'X-CSRF-Token': csrfToken.value,
      }
    })

    console.log('Raw response:', result)

    if (result.error) {
      console.error('GraphQL Error:', result.error)
      throw new Error(JSON.stringify(result.error))
    }

    if (!result.data) {
      throw new Error('No data returned from the mutation')
    }

    console.log('Post created:', result.data)
    // Clear the form fields after successful submission
    title.value = 'Post '
    message.value = ''
  } catch (err) {
    console.error('Error creating post:', err)
    if (err.response) {
      console.error('Response status:', err.response.status)
      console.error('Response data:', await err.response.text())
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form method="post" @submit.prevent="submitPost">
    <div class="mb-6 mt-4">
      <label for="message" class="font-bold">Message</label>
      <textarea name="message" class="w-full px-6 py-4" required id="message" v-model="message"></textarea>
    </div>
    <input type="submit" class="rounded font-bold bg-red-600 text-slate-50 px-6 py-4" value="Post entry" :disabled="loading">
  </form>
</template>
