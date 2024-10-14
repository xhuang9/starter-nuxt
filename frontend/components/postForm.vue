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
    console.log('CSRF acquired ' + data.csrfToken)
    return data.csrfToken
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
  console.log('submitPost function called')
  if (!csrfToken.value) {
    console.error('CSRF token not available')
    return
  }

  loading.value = true
  try {
    console.log('Submitting post with title:', title.value, 'and message:', message.value)
    console.log('CSRF Token:', csrfToken.value)

    // First, test the ping mutation
    const pingResult = await GqlTestMutation({
      headers: {
        'X-CSRF-Token': csrfToken.value,
      },
      clientId: 'posts'
    })
    console.log('Ping result:', JSON.stringify(pingResult, null, 2))

    // Now, try the actual post creation
    const result = await GqlCreatePost({
      variables: {
        title: title.value,
        message: message.value
      },
      headers: {
        'X-CSRF-Token': csrfToken.value,
      },
      clientId: 'posts'
    })

    console.log('Full GraphQL response:', JSON.stringify(result, null, 2))

    if (result.errors) {
      console.error('GraphQL Errors:', JSON.stringify(result.errors, null, 2))
      throw new Error(JSON.stringify(result.errors))
    }

    if (!result.data || !result.data.save_posts_text_Entry) {
      console.error('Unexpected response structure:', JSON.stringify(result, null, 2))
      throw new Error('No data returned from the mutation')
    }

    console.log('Post created successfully:', result.data.save_posts_text_Entry)
    // Clear the form fields after successful submission
    title.value = 'Post '
    message.value = ''
  } catch (err) {
    console.error('Error creating post:', err)
    console.error('Error details:', JSON.stringify(err, null, 2))
    if (err.response) {
      console.error('GraphQL response:', JSON.stringify(err.response, null, 2))
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
