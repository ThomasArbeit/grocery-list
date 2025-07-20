<script setup lang="ts">
</script>

<template>
  <div class="p-4 pb-24 space-y-4 bg-stone-100 min-h-screen">
    <!-- <Transition name="page" mode="out-in"> -->
      <router-view/>
    <!-- </Transition> -->
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.page-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
