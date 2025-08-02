<template>

  <Page :title="groceryList!.title">
    <Transition name="fade" mode="out-in">
      <EmptyPage v-if="!groceryItems.length && !isLoading" 
      title="Aucun produit" 
      description="Vous pouvez ajouter des produits en cliquant sur le bouton + en bas" 
      icon="ShoppingBag" />
  
      <TransitionGroup v-else name="fade" tag="ul" class="flex flex-col space-y-4">
        <li v-for="list in groupAndSortByCategory" :key="list.category" class="flex flex-col" >
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
    </Transition>

    <teleport to="#page-actions">
      <TransitionGroup name="fade-bottom" tag="span">
        <Button v-if="hasDoneItems" @click="handleDeleteAll" size="md" outline>
          <div class="flex space-x-1 items-center">
            <span>Supprimer </span>
            <Transition name="fade-number" mode="out-in">
              <span :key="numberOfDoneItems">{{ numberOfDoneItems }}</span>
            </Transition>
          </div>
        </Button>
      </TransitionGroup>
      <Button @click="toggleSheet" size="md">+ Ajouter</Button>
    </teleport>
    
    <BottomSheet v-model="show">
      <NewGroceryItemForm @close="toggleSheet" @added="handleAdd"/>
    </BottomSheet>
  </Page>
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
import EmptyPage from '../components/EmptyPage.vue';
import Page from '../components/Page.vue';


const show = ref(false);
const isLoading = ref(false);
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
  isLoading.value = true;
  await fetchGroceryList();
  await fetchGroceryItems();
  isLoading.value = false;
});
</script>