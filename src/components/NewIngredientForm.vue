<template>
  <div class="flex flex-col space-y-6">
    <div class="flex flex-col space-y-4">
      <h2 class="text-lg font-semibold">Nouvel ingredient</h2>
      <Input v-model="newItem.name" label="Produit" placeholder="Ex: Compote de pomme"/>
      <Input v-model="newItem.quantity" label="Quantité" placeholder="Ex: 6"/>
      <AutocompleteInput
        v-model="newItem.category"
        :options="['Fruits', 'Légumes', 'Viandes', 'Produits laitiers', 'Épicerie sucrée', 'Épicerie salée']"
        label="Catégorie"
        top
        placeholder="Ex: Épicerie sucrée"
      />
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
import AutocompleteInput from './AutocompleteInput.vue';
import type { RecipeIngredientType } from '../types/RecipeIngredient';
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'added', payload: Partial<RecipeIngredientType>): void;
}>();

const newItem = ref({
  name: '',
  category: '',
  quantity: '1',
  recipe_list_id: Number(router.currentRoute.value.params.id),
});

function handleAdd() {
  emit('added', newItem.value);
  nextTick(() => {
    newItem.value.name = '';
    newItem.value.category = '';
    newItem.value.quantity = '1';
  });
}
</script>