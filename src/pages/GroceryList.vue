<template>
  <div class="flex flex-col space-y-4">
    <h1 class="text-2xl font-bold mb-6">{{ groceryList?.title }}</h1>
      <TransitionGroup name="fade" tag="ul" class="flex flex-col space-y-4">
      <li v-for="list in groupAndSortByCategory" :key="list.category" class="flex flex-col ">
        <h2 class="text-sm font-semibold text-stone-400">{{ list.category }}</h2>
        <TransitionGroup class="flex flex-col" name="fade" tag="ul">
          <GroceryItem
          v-for="(item, i) in list.items"
          :key="item.id"
          :product="item"
          :class="[{'border-t border-stone-200': i !== 0}]"
          class="cursor-pointer"/>
        </TransitionGroup>
      </li>
    </TransitionGroup>
    <Button v-if="hasDoneItems" @click="handleDeleteAll" size="md" outline class="fixed left-4 bottom-12 right-4">Supprimer {{ numberOfDoneItems }} cochés</Button>
    <Button @click="toggleSheet" size="md" class="fixed left-4 bottom-4 right-4">+ Ajouter un produit</Button>
    <BottomSheet v-model="show">
      <NewGroceryItemForm @close="toggleSheet" @added="handleAdd"/>
    </BottomSheet>
  </div>
</template>

<script lang="ts" setup>
import Button from '../components/Button.vue';
import BottomSheet from '../components/BottomSheet.vue';
import { computed, nextTick, onBeforeMount, ref } from 'vue';
import useGroceryService from '../composables/useGroceryService';
import router from '../router';
import NewGroceryItemForm from '../components/NewGroceryItemForm.vue';
import GroceryItem from '../components/GroceryItem.vue';
import type { GroceryListType } from '../types/GroceryListType';
import type { GroceryType } from '../types/GroceryType';


const show = ref(false);
const groceryList = ref<GroceryListType | null>();
const groceryItems = ref<GroceryType[]>([]); // Adjust type as needed

const groupAndSortByCategory = computed(() => {
  const items = groceryItems.value;
  const grouped = items?.reduce((acc, item) => {
    const trimmedCategory = item.category?.trim();
    if (!trimmedCategory) {
      return acc; // Skip items without a category
    }
    if (!acc[trimmedCategory]) {
      acc[trimmedCategory] = [];
    }
    acc[trimmedCategory].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  if (!grouped) return [];

  return Object.entries(grouped).map(([category, items]) => ({
    category,
    items: (items as any[]).sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name)),
  }));
})

const hasDoneItems = computed(() => {
  return groceryItems.value?.some(item => item.done);
});

const numberOfDoneItems = computed(() => {
  return groceryItems.value.filter(item => item.done).length;
});

const toggleSheet = () => {
  show.value = !show.value;
};

async function handleDeleteAll() {
  if (hasDoneItems.value) {
    await useGroceryService().deleteMultipleItemsFromList(groceryList.value?.id || 0, groceryItems.value.filter(item => item.done).map(item => item.id))
    .then(() => {
      groceryItems.value = groceryItems.value.filter(item => !item.done);
    })
  }
}

async function handleAdd(payload: Partial<GroceryType>) {
  const newItem = await useGroceryService().postGroceryListItem(payload);
  if (!newItem) return;
  groceryItems.value.push(newItem);
  nextTick(() => {
    toggleSheet(); 
  });
}

async function fetchGroceryList() {
  const id = Number(router.currentRoute.value.params.id);
  groceryList.value = await useGroceryService().fetchGroceryListById(id);
  if (!groceryList.value) {
    await router.push({ name: 'Home' });
  }
}

async function fetchGroceryItems() {
  const id = Number(router.currentRoute.value.params.id);
  groceryItems.value = await useGroceryService().fetchGroceryListItemsByListId(id);
}

onBeforeMount(async() => {
  await fetchGroceryList();
  await fetchGroceryItems();
});
</script>