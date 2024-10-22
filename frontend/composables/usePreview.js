import { ref, onMounted } from 'vue';
import { useRoute } from '#app';

export function usePreview() {
  const previewToken = ref(null);

  onMounted(() => {
    const route = useRoute();
    previewToken.value = route.query['x-craft-live-preview'] ?? null;
  });

  return {
    previewToken
  };
}