<template>
  <div class="flex flex-col space-y-4">
    <h1 class="text-xl font-bold mb-6">Vos listes de courses</h1>
    <div class="flex flex-col">
      <!-- <TransitionGroup class="relative flex flex-col align-center" name="fade" tag="ul">
        <li v-for="(group, index) in groupedLists" :key="index" class="mb-6"> -->
          <h2 class="text-sm font-semibold text-stone-400">{{ groceryLists.length }} listes</h2>
          <TransitionGroup class="relative flex flex-col align-center" name="fade" tag="ul">
            <GroceryList
            v-for="(list, i) in groceryLists"
            :key="list.id"
            :list="list"
            :style="{ transitionDelay: `${i * 50}ms` }"
            :class="{'border-t border-stone-200': i !== 0}"
            @delete="handleDelete"
            />
          </TransitionGroup>
        <!-- </li>
      </TransitionGroup> -->
    </div>

    <teleport to="#page-actions">
      <Button @click="toggleSheet" size="md" >
        <div class="flex space-x-1 items-center">
          <Plus class="w-5 h-5"/>
          <span>
            Creer une liste
          </span>
        </div>
      </Button>
    </teleport>


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

// const groupedLists = computed(() => {
//   const now = Date.now();
//   const threeDaysInMs = 1 * 24 * 60 * 60 * 1000;
//   const returnArray = [];

//   const ongoing = groceryLists.value.filter(list => {
//     const createdAt = new Date(list.createdAt).getTime();
//     return now - createdAt <= threeDaysInMs;
//   });

//   const past = groceryLists.value.filter(list => {
//     const createdAt = new Date(list.createdAt).getTime();
//     return now - createdAt > threeDaysInMs;
//   });

//   ongoing.length ? returnArray.push({ title: 'En cours', lists: ongoing }) : null
//   past.length ? returnArray.push({ title: 'Passées', lists: past }) : null;

//   return returnArray
// });


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