<template>
  <div class="flex flex-col space-y-4">
    <h1 class="text-2xl font-bold mb-6">Vos listes de courses</h1>
    <div class="flex flex-col">
      <h2 class="text-sm font-semibold text-stone-400">{{ groceryLists.length }} listes</h2>
      <ul>
        <li @click="router.push({name: 'GroceryList', params: {id: list?.id}})" 
        v-for="(list, i) in groceryLists" 
        :key="list?.id" 
        class="flex space-x-4 py-4 transition-colors duration-200" 
        :class="[{'border-t border-stone-200': i !== 0}]">
          <div class="rounded-2xl h-12 w-12 bg-stone-200"></div>
          <div class="flex flex-col space-y-1">
            <h2 class="font-semibold">{{ list?.title }}</h2>
            <p class="text-sm text-stone-400">{{ list?.items.length }} Produits</p>
          </div>
        </li>
      </ul>
    </div>
    <Button @click="toggleSheet" size="md" class="fixed left-4 bottom-0 right-4">+ Creer une liste</Button>
    <BottomSheet v-model="show">
      <NewListForm @close="toggleSheet" @added="handleAdd()"/>
    </BottomSheet>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import Button from '../components/Button.vue';
import BottomSheet from '../components/BottomSheet.vue';
import NewListForm from '../components/NewListForm.vue';
import useGroceryService from '../composables/useGroceryService';
import router from '../router';
import type { GroceryListType } from '../types/GroceryListType';

const show = ref(false);
const groceryLists = ref<GroceryListType[]>([]);

onBeforeMount(() => {
  groceryLists.value = useGroceryService().getListsFromLocalStorage();
})

const toggleSheet = () => {
  show.value = !show.value;
};

function handleAdd() {
  groceryLists.value = useGroceryService().getListsFromLocalStorage();
  toggleSheet();
}

</script>