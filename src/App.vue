<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

// Layouts
import DefaultLayout from './layouts/DefaultLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'

const route = useRoute()

// Choix du layout en fonction des meta
const layout = computed(() =>
  route.meta.authLayout ? AuthLayout : DefaultLayout
)
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
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
