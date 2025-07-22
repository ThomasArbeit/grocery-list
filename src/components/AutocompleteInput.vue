<template>
  <div class="relative w-full flex flex-col space-y-2">
    <p v-if="label" class="font-semibold text-sm">{{ label }}</p>
    <input
      v-model="search"
      @keydown.down.prevent="move(1)"
      @keydown.up.prevent="move(-1)"
      @keydown.enter.prevent="select(activeIndex)"
      type="text"
      class="bg-white border border-stone-300 rounded-lg px-4 py-2 w-full outline-none focus:ring-1 focus:ring-stone-400 transition-colors duration-200" 
      :placeholder="placeholder"
      @focus="open = true"
      @blur="close"
    />
    
    <ul
      v-if="open && filtered.length && search"
      class="absolute z-10 mt-1 w-full bg-white border border-stone-300 rounded-md shadow max-h-60 overflow-y-auto"
      :class="{'top-[100%]' : bottom, 'bottom-[100%]': top}"
    >
      <li
        v-for="(option, index) in filtered"
        :key="option"
        @mousedown.prevent="select(index)"
        :class="[
          'px-4 py-2 cursor-pointer',
          index === activeIndex ? 'bg-blue-100' : 'hover:bg-gray-100'
        ]"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{
  label?: string;
  options: string[];
  modelValue: string;
  placeholder?: string;
  bottom?: boolean;
  top?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const search = ref(props.modelValue);
const open = ref(false);
const activeIndex = ref(-1);

const filtered = computed(() =>
  props.options.filter(option =>
    option.toLowerCase().includes(search.value.toLowerCase())
  )
);

watch(search, value => {
  emit('update:modelValue', value);
  activeIndex.value = -1;
  open.value = true;
});

function move(direction: number) {
  if (!filtered.value.length) return;
  activeIndex.value = (activeIndex.value + direction + filtered.value.length) % filtered.value.length;
}

function select(index: number) {
  const selected = filtered.value[index];
  if (selected) {
    search.value = selected;
    open.value = false;
  }
}

function close() {
  // Attendre avant de fermer pour laisser le click sur un item passer
  setTimeout(() => {
    open.value = false;
  }, 100);
}
</script>
