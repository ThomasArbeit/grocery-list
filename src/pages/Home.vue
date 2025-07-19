<template>
  <div class="flex flex-col space-y-4">
    <h1 class="text-xl font-semibold">Vos listes de courses</h1>
    <ul class="space-y-4">
      <li @click="router.push({name: 'GroceryList', params: {id: list?.id}})" v-for="list in groceryLists" :key="list?.id" class="px-4 py-3 bg-white rounded-lg border border-stone-200">
        <h2 class="font-semibold">{{ list?.title }}</h2>
        <p class="text-sm text-gray-500">ID: {{ list?.id }}</p>
      </li>
    </ul>
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