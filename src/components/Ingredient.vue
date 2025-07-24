<template>
  <li class="flex justify-between items-center py-4 transition-colors duration-200">
    <div class="flex items-center space-x-3">
      <span class="font-semibold transition-colors duration-200">{{ product.name }}</span>
    </div>
    <span class="text-stone-400">x{{ product.quantity }}</span>
  </li>
</template>

<script lang="ts" setup>
import type { RecipeIngredientType } from '../types/RecipeIngredient';
  const props = defineProps<{
    product: RecipeIngredientType
  }>();
</script>