<!-- components/BaseToast.vue -->
<template>
  <Transition
    name="fade-slide"
    appear
    @before-leave="beforeLeave"
  >
    <div
      v-show="visible"
      class="bg-stone-800 text-white flex justify-between items-center gap-4"
      :class="[
        'px-4 py-3 rounded-xl shadow animate-fade',
        type === 'success' && 'bg-green-500',
        type === 'warning' && 'bg-yellow-500 text-black',
        type === 'danger' && 'bg-red-500'
      ]"
    >
      {{ message }}
      <RouterLink :to="link.to">{{ link.label }}</RouterLink>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'success',
  },
  link: {
    type: Object,
    default: () => (undefined),
  },
})

const visible = ref(true)

function beforeLeave(el) {
  el.style.transform = 'translateY(-10px)'
  el.style.opacity = 0
}

onMounted(() => {
  setTimeout(() => {
    visible.value = false
  }, 2800) // Slightly before auto-remove
})
</script>

<style>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
