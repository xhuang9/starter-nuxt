import { useState } from '#app'

export const useFlashes = () => {
  const flashes = useState('flashes', () => [])

  const addFlash = (message, type = 'info') => {
    const id = Date.now()
    flashes.value.push({ id, message, type })
    setTimeout(() => removeFlash(id), 5000) // Auto-remove after 5 seconds
  }

  const removeFlash = (id) => {
    flashes.value = flashes.value.filter(flash => flash.id !== id)
  }

  return {
    flashes,
    addFlash,
    removeFlash
  }
}
