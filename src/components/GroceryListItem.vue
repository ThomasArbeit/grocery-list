<template>
  <li 
  @click="handleClick"
  class="flex items-center justify-between py-4 transition-colors duration-200 select-none">
    <h2 class="font-semibold">{{ list.title }} </h2>
    <div class="flex items-center space-x-2">
      <Transition name="fade-right" mode="out-in">
        <ChevronRight v-if="!props.selecting" class="text-stone-700 right-1 w-5 h-5"/>
        <div 
        v-else
        class="h-6 w-6 rounded-full border border-stone-500 flex items-center justify-center cursor-pointer"
        :class="{'bg-stone-900 text-white border-stone-900': props.selected}"
        >
        <CheckIcon v-if="props.selected" class="w-4 h-4 text-white"/>
      </div>
      </Transition>
    </div>
  </li>
</template>

<script lang="ts" setup>
import type { GroceryListType } from '../types/GroceryListType';
import router from '../router';
import { CheckIcon, ChevronRight } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'delete', id: number): void;
  (e: 'select', id: number): void;
}>();

const props = defineProps({
  list: {
    type: Object as () => GroceryListType,
    required: true,
  },
  selecting: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

function handleClick() {
  if (props.selecting) {
    emit('select', props.list.id);
  } else {
    router.push({ name: 'GroceryList', params: { id: props.list.id } });
  }
}
</script>