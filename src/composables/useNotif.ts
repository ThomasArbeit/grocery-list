// composables/useNotif.js
import { ref } from 'vue'

interface Toast {
  id: number;
  message: string;
  type: string;
  link?: Link;
}

interface Link {
  label: string;
  to: string;
}

const toasts = ref<Toast[]>([])

export function useNotif() {
  function show(message: string, type = 'success', link = undefined as Link | undefined, delay = 300,) {
    const id = Date.now() + Math.random()
    setTimeout(() => {
      toasts.value.push({ id, message, type, link })
    }, delay)
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 3000)
  }

  return { show, toasts }
}
