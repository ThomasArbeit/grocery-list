<template>
  <Transition name="slide-up">
    <div v-if="modelValue" class="fixed inset-0 z-50">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/50" @click="$emit('update:modelValue', false)" />

      <!-- Panel -->
      <div
        class="absolute max-h-[90dvh] bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 shadow-xl overflow-y-auto"
      >
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
});
defineEmits(["update:modelValue"]);
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0%);
  opacity: 1;
}
</style>
