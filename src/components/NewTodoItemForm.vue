<template>
  <div class="flex flex-col space-y-6">
    <div class="flex flex-col space-y-4">
      <h2 class="text-lg font-semibold">Nouvelle tache</h2>
      <Input v-model="newItem.name" label="Tache" placeholder="Ex: Faire la vaisselle"/>
    </div>
    <div class="flex space-x-4">
      <Button @click="$emit('close')" outline class="flex-1">Annuler</Button>
      <Button @click="handleAdd()" class="flex-1">+ Ajouter</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Input from './Input.vue';
import Button from './Button.vue';
import { nextTick, ref } from 'vue';
import router from '../router';
import type { TodoType } from '../types/TodoType';
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'added', payload: Partial<TodoType>): void;
}>();

const newItem = ref({
  done: false,
  name: '',
  todo_list_id: Number(router.currentRoute.value.params.id),
});

function handleAdd() {
  emit('added', newItem.value);
  nextTick(() => {
    newItem.value.name = '';
    newItem.value.done = false;
  });
}
</script>