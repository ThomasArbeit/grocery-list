<template>
  <div class="flex flex-col space-y-4">
    <h1 class="text-2xl font-bold mb-6">{{ groceryList.title }}</h1>
    <ul class="flex flex-col space-y-4">
      <li v-for="list in groupAndSortByCategory" :key="list.category" class="flex flex-col ">
        <h2 class="text-sm font-semibold text-stone-400">{{ list.category }}</h2>
        <ul class="flex flex-col">
          <GroceryItem
          v-for="(item, i) in list.items" 
          :class="[{'border-t border-stone-200': i !== 0}]"
          :key="item.id" 
          :product="item" 
          @click="handleToggleDone(item.id)" 
          class="cursor-pointer"/>
        </ul>
      </li>
    </ul>
    <Button v-if="hasDoneItems" @click="handleDeleteAll" size="md" secondary class="fixed left-4 bottom-12 right-4">Supprimer {{ numberOfDoneItems }} cochés</Button>
    <Button @click="toggleSheet" size="md" class="fixed left-4 bottom-0 right-4">+ Ajouter un produit</Button>
    <BottomSheet v-model="show">
      <NewGroceryItemForm @close="toggleSheet" @added="handleAdd()"/>
    </BottomSheet>
  </div>
</template>

<script lang="ts" setup>
import Button from '../components/Button.vue';
import BottomSheet from '../components/BottomSheet.vue';
import { computed, onBeforeMount, ref } from 'vue';
import useGroceryService from '../composables/useGroceryService';
import router from '../router';
import NewGroceryItemForm from '../components/NewGroceryItemForm.vue';
import GroceryItem from '../components/GroceryItem.vue';


const show = ref(false);
const groceryList = ref({
  id: '',
  title: '',
  items: [],
  done: false,
});

const groupAndSortByCategory = computed(() => {
  const items = groceryList.value.items;
  const grouped = items.reduce((acc: Record<string, any[]>, item: any) => {
    const trimmedCategory = item.category.trim();
    if (!acc[trimmedCategory]) {
      acc[trimmedCategory] = [];
    }
    acc[trimmedCategory].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  return Object.entries(grouped).map(([category, items]) => ({
    category,
    items: (items as any[]).sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name)),
  }));
})

const hasDoneItems = computed(() => {
  return groceryList.value.items.some(item => item.done);
});

const numberOfDoneItems = computed(() => {
  return groceryList.value.items.filter(item => item.done).length;
});


const toggleSheet = () => {
  show.value = !show.value;
};

// function handleDelete(itemId: number) {
//   useGroceryService().deleteOneItemFromList(Number(router.currentRoute.value.params.id), itemId);
//   groceryList.value = useGroceryService().getListById(Number(router.currentRoute.value.params.id));
// }

function handleDeleteAll() {
  if (hasDoneItems.value) {
    useGroceryService().deleteAllDoneItemsInList(Number(router.currentRoute.value.params.id));
    groceryList.value = useGroceryService().getListById(Number(router.currentRoute.value.params.id));
  }
}

function handleAdd() {
  groceryList.value = useGroceryService().getListById(Number(router.currentRoute.value.params.id));
  toggleSheet(); 
}

function handleToggleDone(itemId: number) {
  useGroceryService().toggleItemDone(Number(router.currentRoute.value.params.id), itemId);
  groceryList.value = useGroceryService().getListById(Number(router.currentRoute.value.params.id));
}

onBeforeMount(() => {
  groceryList.value = useGroceryService().getListById(Number(router.currentRoute.value.params.id));
  if (!groceryList.value) {
    router.push({ name: 'Home' });
  }
});
</script>