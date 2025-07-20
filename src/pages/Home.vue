<template>
  <div class="flex flex-col space-y-4">
    <h1 class="text-2xl font-bold mb-6">Vos listes de courses</h1>
    <div class="flex flex-col">
      <h2 class="text-sm font-semibold text-stone-400">{{ groceryLists.length }} listes</h2>
      <TransitionGroup class="relative flex flex-col align-center" name="fade" tag="ul">
        <GroceryList
        v-for="(list, i) in groceryLists"
        :key="list.id"
        :list="list"
        :class="{'border-t border-stone-200': i !== 0}"
        @delete="handleDelete"
        />
      </TransitionGroup>
    </div>
    <Button @click="toggleSheet" size="md" class="fixed left-4 bottom-4 right-4">
      <div class="flex space-x-1 items-center">
        <Plus class="w-5 h-5"/>
        <span>
          Creer une liste
        </span>
      </div>
    </Button>
    <BottomSheet v-model="show">
      <NewListForm @close="toggleSheet" @added="handleAdd"/>
    </BottomSheet>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import Button from '../components/Button.vue';
import BottomSheet from '../components/BottomSheet.vue';
import NewListForm from '../components/NewListForm.vue';
import useGroceryService from '../composables/useGroceryService';
import GroceryList from '../components/GroceryListItem.vue';
import type { GroceryListType } from '../types/GroceryListType';
import { Plus } from 'lucide-vue-next';

const show = ref(false);
const isLoading = ref(false);
const groceryLists = ref<GroceryListType[]>([]);

onBeforeMount(async() => {
  groceryLists.value = await useGroceryService().fetchGroceryLists();
})

const toggleSheet = () => {
  show.value = !show.value;
};

async function handleAdd(payload: Partial<GroceryListType>) {
  isLoading.value = true;
  const newGroceryList = await useGroceryService().postGroceryList(payload);
  if (!newGroceryList) {
    isLoading.value = false;
    return;
  }

  groceryLists.value.push(newGroceryList);
  toggleSheet();
  isLoading.value = false;
}


async function handleDelete(id: number) {
  await useGroceryService().deleteGroceryList(id)
  .then(() => {
    groceryLists.value = groceryLists.value.filter(list => list.id !== id);
  })
  .catch(error => {
    console.error('Error deleting grocery list:', error);
  });
}

</script>

<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease;
  }
  .fade-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }
  .fade-enter-to {
    opacity: 1;
    transform: translateY(0);
  }
  .fade-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
</style>