<template>
  <div class="min-h-screen flex bg-white p-4">
    <Transition name="page" mode="out-in">
      <slot />
    </Transition>
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import ToastContainer from '../components/ToastContainer.vue';
</script>
