<template>
  <button 
  class="cursor-pointer flex items-center justify-center px-4 py-2 rounded-xl font-semibold"
  :class="[
    {'bg-stone-800 text-white hover:bg-stone-900 border border-stone-900': !secondary && !outline && !ghost && !link && !destructive && !disabled },
    {'bg-stone-200 hover:bg-stone-300 focus:bg-stone-300 border border-stone-300': secondary },
    {'border border-stone-300 hover:border-stone-400 bg-white text-black': outline },
    {'bg-transparent text-stone-800 hover:bg-stone-100': ghost },
    {'bg-red-500 text-white hover:bg-red-600': destructive },
    {'text-blue-500 hover:text-blue-600': link },
    {'opacity-50 cursor-not-allowed': disabled },
    {'px-2 py-1 text-sm': size === 'sm' },
    {'px-4 py-2 text-base': size === 'md' || !size },
    {'px-6 py-3 text-lg': size === 'lg' }
    ]">
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>

// This is a simple button component that can be reused throughout the application.
// It uses Tailwind CSS for styling and accepts any content to be passed as a slot.
defineProps<{
  secondary?: boolean; // Optional prop to determine if the button is secondary
  outline?: boolean; // Optional prop to determine if the button is outlined
  ghost?: boolean; // Optional prop to determine if the button is ghost
  link?: boolean; // Optional prop to determine if the button is a link
  disabled?: boolean; // Optional prop to disable the button
  destructive?: boolean; // Optional prop to indicate a destructive action
  size?: 'sm' | 'md' | 'lg'; // Optional prop to set the button size
}>();
</script>