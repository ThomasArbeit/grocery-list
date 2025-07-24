<template>
  <li 
  @click="handleClick"
  class="flex items-center justify-between py-4 transition-all duration-200 select-none"
  :class="{
    'bg-stone-200 px-4 rounded-lg': props.selecting && props.selected, 
    'px-4': props.selecting,
    }">
    <h2 class="font-semibold">{{ list.title }} </h2>
    <div class="flex items-center space-x-2">
      <Transition name="fade-right" mode="out-in">
        <ChevronRight v-if="!props.selecting" class="text-stone-700 right-1 w-5 h-5"/>
        <div 
        v-else
        class="h-6 w-6 rounded-lg border border-stone-500 flex items-center justify-center cursor-pointer transition-colors duration-200"
        :class="{'bg-stone-900 text-white border-stone-900': props.selected}"
        >
        <CheckIcon v-if="props.selected" class="w-4 h-4 text-white"/>
      </div>
      </Transition>
    </div>
  </li>
</template>

<script lang="ts" setup>
import router from '../router';
import { CheckIcon, ChevronRight } from 'lucide-vue-next';
import type { RecipeListType } from '../types/RecipeListType';

const emit = defineEmits<{
  (e: 'delete', id: number): void;
  (e: 'select', id: number): void;
}>();

const props = defineProps({
  list: {
    type: Object as () => RecipeListType,
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
    router.push({ name: 'RecipeDetail', params: { id: props.list.id } });
  }
}
</script>