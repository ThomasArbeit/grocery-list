<!-- components/BottomSheet.vue -->
<template>
  <div v-show="modelValue" class="fixed inset-0 z-50">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/50" @click="$emit('update:modelValue', false)" />

    <!-- Panel -->
    <div
    class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 shadow-xl delay-150 transition-transform duration-300"
    :class="{ 'translate-y-0': modelValue, 'translate-y-full': !modelValue }">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
/* Facultatif pour améliorer l’animation */
</style>
