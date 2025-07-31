<template>
  <li class="flex justify-between items-center py-4 transition-all duration-200 select-none" 
  :class="{
    'bg-stone-200 px-4 rounded-lg': selecting && selected, 
    'px-4': selecting,
  }"
  @click="handleClick">
    <div class="flex items-center space-x-3">
      <span class="font-semibold transition-colors duration-200">{{ product.name }}</span>
    </div>
    <Transition name="fade-right" mode="out-in">
      <div 
      v-if="selecting"
      class="h-6 ml-3 w-6 rounded-lg border border-stone-500 flex items-center justify-center cursor-pointer transition-colors duration-200"
      :class="{'bg-stone-900 text-white border-stone-900': selected}"
      >
        <CheckIcon v-if="selected" class="w-4 h-4 text-white"/>
      </div>
      <span v-else class="text-stone-400">x{{ product.quantity }}</span>
    </Transition>
  </li>
</template>

<script lang="ts" setup>
import { CheckIcon } from 'lucide-vue-next';
import type { RecipeIngredientType } from '../types/RecipeIngredient';
  const props = defineProps<{
    product: RecipeIngredientType,
    selecting: boolean
    selected: boolean,
  }>();

  const emit = defineEmits<{
    (e: 'select', id: number): void;
  }>();

  function handleClick () {
    if (props.selecting) {
      emit('select', props.product.id);
    }
  };
</script>