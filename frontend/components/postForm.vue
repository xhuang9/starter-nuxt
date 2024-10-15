<script setup>
import { computed, ref } from 'vue'
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()
const message = ref('')
const authorId = ref(1)
const loading = ref(false)

const generateTitle = (text) => {
  const words = text.split(' ').slice(0, 3).join(' ').trim()
  return `Post: ${words}${words ? '...' : ''}`
}

const title = computed(() => generateTitle(message.value))
''
const submitPost = async () => {
  if (!message.value.trim()) {
    console.error('Message is required')
    return
  }
  loading.value = true
  try {
    const result = await $fetch(config.public.GQL_HOST, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.public.AUTH_HEADER}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation createPost($title: String!, $message: String, $authorId: ID!) {
            save_posts_text_Entry(
              title: $title,
              textBlock: $message,
              authorId: $authorId
            ) {
                title
                textBlock
            }
          }
        `,
        variables: {
          title: title.value,
          message: message.value,
          authorId: authorId.value
        }
      })
    })

    if (result.errors) {
      throw new Error('Error creating post: ' + JSON.stringify(result.errors))
    }

    if (!result.data || !result.data.save_posts_text_Entry) {
      throw new Error('No data returned from the mutation')
    }

    console.log('Post created successfully')
    // Clear the form fields after successful submission
    title.value = 'Post '
    message.value = ''
  } catch (err) {
    console.error('Error creating post:', err.message)
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
