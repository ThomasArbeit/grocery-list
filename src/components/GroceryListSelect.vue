<template>
  <div class="flex flex-col space-y-4">
    <h2 class="text-lg font-semibold">Vos listes de courses</h2>
    <div class="flex flex-col">
      <li
      v-for="(list) in groceryLists"
      @click="handleClick(list.id)"
      class="flex items-center justify-between py-4 transition-all duration-200 select-none border-t border-stone-200">
      <div class="">
        <h2 class="font-semibold">{{ list.title }} </h2>
        <p class="text-stone-400 text-sm">Privé</p>
      </div>
      <div class="flex items-center space-x-2">
        <PlusCircle class="w-6 h-6 text-stone-500 cursor-pointer"/>
      </div>
    </li>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import type { GroceryListType } from '../types/GroceryListType';
import useGroceryService from '../composables/useGroceryService';
import { PlusCircle } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'add', payload: GroceryListType['id']): void;
}>();

const groceryLists = ref<GroceryListType[]>([])

onBeforeMount(async () => {
  groceryLists.value = await useGroceryService().fetchGroceryLists();
})

function handleClick(listId: GroceryListType['id']) {
  emit('add', listId);
  emit('close');
};
</script>