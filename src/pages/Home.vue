<template>
  <div class="flex flex-col space-y-4">
    <h1 class="text-xl font-bold mb-6">Vos listes de courses</h1>

    <div class="flex flex-col">
      <h2 class="text-sm font-semibold text-stone-400">{{ groceryLists.length }} listes</h2>
      <TransitionGroup class="relative flex flex-col align-center" name="fade" tag="ul">
        <GroceryListItem
        v-longpress="() => handleSelect(list)"
        v-for="(list, i) in groceryLists"
        :key="list.id"
        :list="list"
        :style="{ transitionDelay: `${i * 50}ms` }"
        :class="{'border-t border-stone-200': i !== 0}"
        :selecting="hasSelectedList"
        :selected="isSelected(list)"
        @delete="handleDelete"
        @select="handleSelect(list)"
        />
      </TransitionGroup>
    </div>

    <teleport to="#page-actions">
      <TransitionGroup name="fade-bottom" tag="span">
        <Button v-if="hasSelectedList" @click="handleDeleteAll" size="md" outline>
          <div class="flex space-x-1 items-center">
            <span>Supprimer </span>
            <Transition name="fade-number" mode="out-in">
              <span :key="numberOfSelectedLists">{{ numberOfSelectedLists }}</span>
            </Transition>
          </div>
        </Button>
      </TransitionGroup>
      <Button v-if="!hasSelectedList" @click="toggleSheet" size="md" >
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
import { computed, onBeforeMount, ref } from 'vue';
import Button from '../components/Button.vue';
import BottomSheet from '../components/BottomSheet.vue';
import NewListForm from '../components/NewListForm.vue';
import useGroceryService from '../composables/useGroceryService';
import type { GroceryListType } from '../types/GroceryListType';
import { Plus } from 'lucide-vue-next';
import GroceryListItem from '../components/GroceryListItem.vue';

const show = ref(false);
const isLoading = ref(false);
const groceryLists = ref<GroceryListType[]>([]);
const selectedList = ref<GroceryListType[]>([]);

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

const hasSelectedList = computed(() => {
  return selectedList.value.length > 0;
});

const numberOfSelectedLists = computed(() => {
  return selectedList.value.length;
});

function isSelected(list: GroceryListType) {
  return selectedList.value?.find(item => item.id === list.id) ? true : false;
}

function handleSelect(list: GroceryListType) {
  if (selectedList.value?.find(l => l.id === list.id)) {
    selectedList.value = selectedList.value.filter(item => item.id !== list.id);
  } else {
    selectedList.value?.push(list);
  }
}

async function handleAdd(payload: Partial<GroceryListType>) {;
  const newGroceryList = await useGroceryService().postGroceryList(payload);
  if (!newGroceryList) {
    isLoading.value = false;
    return;
  }

  groceryLists.value.push(newGroceryList);
  toggleSheet()
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

async function handleDeleteAll() {
  if (hasSelectedList.value) {
    await useGroceryService().deleteMultipleLists(selectedList.value.map(list => list.id))
    .then(() => {
      groceryLists.value = groceryLists.value.filter(list => !selectedList.value.find(l => l.id === list.id));
      selectedList.value = [];
    })
    .catch(error => {
      console.error('Error deleting selected grocery lists:', error);
    });
  }
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

  .fade-number-enter-active,
  .fade-number-leave-active {
    transition: all 0.15s ease;
  }
  .fade-number-enter-from {
    opacity: 0;
    transform: translateY(8px);
  }
  .fade-number-enter-to {
    opacity: 1;
    transform: translateY(0);
  }
  .fade-number-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
  .fade-number-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }

  .fade-bottom-enter-active,
  .fade-bottom-leave-active {
    transition: all 0.3s ease;
  }
  .fade-bottom-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }
  .fade-bottom-enter-to {
    opacity: 1;
    transform: translateY(0);
  }
  .fade-bottom-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
  .fade-bottom-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }

  .fade-right-enter-active,
  .fade-right-leave-active {
    transition: all 0.3s ease;
  }
  .fade-right-enter-from {
    opacity: 0;
    transform: translateX(10px);
  }
  .fade-right-enter-to {
    opacity: 1;
    transform: translateX(0);
  }
  .fade-right-leave-from {
    opacity: 1;
    transform: translateX(0);
  }
  .fade-right-leave-to {
    opacity: 0;
    transform: translateX(10px);
  }
</style>