<template>
  <div class="flex flex-col items-center justify-center relative h-128 overflow-hidden">
    <img class="absolute z-0 top-1 scale-125 opacity-80" src="../assets/mask.png" alt="">
    <div class="flex flex-col items-center justify-center relative z-1">
      <Icon :name="icon" class="w-10 h-10 text-stone-500 mb-4 border border-stone-300 p-2 rounded-lg bg-white shadow-xl"/>
      <h2 class="text-xl font-semibold">{{ title  }}</h2>
      <p class="text-sm text-stone-500 w-64 text-center">{{ description }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Icon from './Icon.vue';

defineProps<{
  title: string; // Optional title for the empty page
  description: string; // Optional description for the empty page
  icon?: string; // Optional icon to display on the empty page
}>();
</script>