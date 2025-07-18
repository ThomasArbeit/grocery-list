<template>
  <div class="flex flex-col space-y-6">
    <div class="flex flex-col space-y-4">
      <h2 class="text-lg font-semibold">Nouveau produit</h2>
      <Input v-model="newItem.name" label="Produit" placeholder="Ex: Compote de pomme"/>
      <Input v-model="newItem.quantity" label="Quantité" placeholder="Ex: 6"/>
      <Input v-model="newItem.category" label="Categorie" placeholder="Ex: Épicerie sucrée"/>
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
import useGroceryService from '../composables/useGroceryService';
import router from '../router';
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'added'): void;
}>();

const newItem = ref({
  id: Date.now(),
  done: false,
  name: '',
  category: '',
  quantity: 1,
});

function handleAdd() {
  useGroceryService().addItemToList(Number(router.currentRoute.value.params.id), newItem.value);
  nextTick(() => {
    newItem.value.name = '';
    newItem.value.category = '';
    newItem.value.quantity = 1;
    newItem.value.id = Date.now();
    newItem.value.done = false;
  });
  emit('added');
}
</script>