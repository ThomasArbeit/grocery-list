<!-- components/ToastContainer.vue -->
<template>
  <Teleport to="body">
    <div class="fixed bottom-2 right-2 left-2 z-50 flex flex-col gap-2">
      <BaseToast
        v-for="toast in toasts"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type"
        :link="toast.link"
      />
    </div>
  </Teleport>
</template>

<script setup>
import { Link } from 'lucide-vue-next';
import { useNotif } from '../composables/useNotif';
import BaseToast from './BaseToast.vue'

const { toasts } = useNotif()
</script>
