<template>
  <div class="flex items-center justify-between py-4 transition-all duration-200 select-none"
  :class="{
    'bg-stone-200 px-4 rounded-lg': selecting && selected, 
    'px-4': selecting,
  }"
  @click="handleClick">
    <slot></slot>
    <Transition name="fade-right" mode="out-in">
      <div 
        v-if="selecting"
        class="h-6 ml-3 w-6 rounded-lg border border-stone-500 flex items-center justify-center cursor-pointer transition-colors duration-200"
        :class="{'bg-stone-900 text-white border-stone-900': selected}"
        >
        <CheckIcon v-if="selected" class="w-4 h-4 text-white"/>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { CheckIcon } from 'lucide-vue-next';

const props = defineProps({
  selecting: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  id: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits<{
  (e: 'select', id: number): void;
}>();

function handleClick () {
  if (props.selecting) {
    emit('select', props.id);
  }
};
</script>