<template>
  <div class="flex flex-col space-y-6">
    <div class="flex flex-col space-y-4">
      <h2 class="text-lg font-semibold">Nouvelle liste de courses</h2>
      <Input v-model="newListTitle" label="Titre" placeholder="Ex: Pizza Party !"/>
    </div>
    <div class="flex space-x-4">
      <Button @click="$emit('close')" outline class="flex-1">Annuler</Button>
      <Button @click="handleClick()" class="flex-1">+ Creer</Button>
    </div>
  </div>
</template>


<script setup lang="ts">
import Input from './Input.vue';
import Button from './Button.vue';
import { nextTick, ref } from 'vue';
import type { GroceryListType } from '../types/GroceryListType';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'added', payload: Partial<GroceryListType>): void;
}>();

const newListTitle = ref('');

function handleClick() {
  const newGroceryList = {
    title: newListTitle.value,
  };
  nextTick(() => {
    emit('added', newGroceryList);
    newListTitle.value = '';
  })
}
</script>