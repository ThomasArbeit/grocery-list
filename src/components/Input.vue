<template>
  <div class="flex flex-col space-y-2">
    <p v-if="label" class="font-semibold text-sm">{{ label }}</p>
    <input 
    ref="inputRef"
    class="bg-white border border-stone-300 rounded-lg px-4 py-2 w-full outline-none focus:ring-1 focus:ring-stone-400 transition-colors duration-200" 
    :type="props.type || 'text'" 
    v-model="props.modelValue" 
    :placeholder="placeholder"
    @input="change()"/>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';  

const props = defineProps<{
  modelValue: string | number;
  label?: string;
  type?: string; // Optional prop to specify input type, default is 'text'
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);

const change = () => {
  if (inputRef.value) {
    emit('update:modelValue', inputRef.value.value);
  }
};

</script>