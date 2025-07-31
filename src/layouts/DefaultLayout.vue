<template>
  <div class="p-4 pb-24 space-y-4 bg-white min-h-screen">
    <Transition name="page" mode="out-in">
      <slot />
    </Transition>
    <ToastContainer />
    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import BottomNavBar from '../components/BottomNavBar.vue';
import ToastContainer from '../components/ToastContainer.vue';
</script>
