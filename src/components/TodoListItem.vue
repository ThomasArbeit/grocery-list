<template>
  <li 
  @click="router.push({name: 'TodoList', params: {id: list.id}})"
  class="flex items-center justify-between py-4 transition-colors duration-200">
    <h2 class="font-semibold">{{ list.title }} </h2>
    <ChevronRight class="text-stone-700 right-1 w-5 h-5" @click.stop="handleDelete"/>
  </li>
</template>

<script lang="ts" setup>
import type { GroceryListType } from '../types/GroceryListType';
import router from '../router';
import { ChevronRight } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'delete', id: number): void;
}>();

const props = defineProps({
  list: {
    type: Object as () => GroceryListType,
    required: true,
  },
});

function handleDelete() {
  emit('delete', props.list.id);
}
</script>