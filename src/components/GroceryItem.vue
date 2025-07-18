<template>
  <li class="flex justify-between items-center py-4 transition-colors duration-200">
    <div class="flex items-center space-x-3">
      <span class="rounded-lg w-6 h-6 flex items-center justify-center transition-colors duration-200 cursor-pointer"
      :class="[`${product.done ? 'bg-green-50 text-green-600 border border-green-600' : 'border border-stone-400 bg-stone-50'}`]">
        <CheckIcon v-if="product.done" class="w-4 h-4"/>
      </span>
      <span class="font-semibold transition-colors duration-200"
      :class="[{'text-stone-400 line-through' : product.done}]">{{ product.name }}</span>
    </div>
    <span class="text-stone-400">x{{ product.quantity }}</span>
  </li>
</template>

<script lang="ts" setup>
import { CheckIcon } from 'lucide-vue-next';
import { GroceryType } from '../types/GroceryType';
  defineProps<{
    product: GroceryType
  }>();
</script>