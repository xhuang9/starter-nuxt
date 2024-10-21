import { ref, onMounted } from 'vue';
import { useRoute } from '#app';

export function usePreview() {
  const preview = ref(false);
  const previewToken = ref(null);

  onMounted(() => {
    const route = useRoute();
    preview.value = route.query['x-craft-live-preview'] === 'true'
    previewToken.value = route.query['x-craft-live-preview'];
  });

  return {
    preview,
    previewToken
  };
}