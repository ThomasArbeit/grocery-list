<template>
  <div class="flex items-center">
    <Button :disabled="count === 1"
      outline 
      size="sm" 
      @click="decrement">
      -
    </Button>
    <span class="mx-4">
      {{ count }}
    </span>
    <Button 
      outline 
      size="sm" 
      @click="increment">
      +
    </Button>
  </div>
</template>

<script lang="ts" setup>
import Button from './Button.vue';
import { ref } from 'vue';

const count = ref(1);
const increment = () => {
  count.value++;
};
const decrement = () => {
  if (count.value === 1) return;
  count.value--;
};
</script>