<template>

  <Page :title="'Vos recettes'"
  :number-of-selected-lists="numberOfSelectedLists">
    <Transition name="fade" mode="out-in">
      <EmptyPage v-if="!recipeLists.length && !isLoading" 
        title="Aucune recette" 
        description="Vous pouvez créer une recette en cliquant sur le bouton + en bas" 
        icon="BookOpen"/>
      
      <div v-else class="flex flex-col">
        <h2 class="text-sm font-semibold text-stone-400">{{ recipeLists.length }} recette(s)</h2>
        <TransitionGroup class="relative flex flex-col align-center" name="fade" tag="ul">
          <RecipeListItem
          v-longpress="() => handleSelect(list)"
          v-for="(list, i) in recipeLists"
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
    </Transition>

    <teleport to="#page-actions">
      <Transition name="fade-bottom" tag="span" mode="out-in">
        <Button v-if="hasSelectedList" @click="handleDeleteAll" size="md" outline>
          <div class="flex space-x-1 items-center">
            <span>Supprimer </span>
            <Transition name="fade-number" mode="out-in">
              <span :key="numberOfSelectedLists">{{ numberOfSelectedLists }}</span>
            </Transition>
          </div>
        </Button>
        <Button v-else @click="toggleSheet" size="md" >
          <div class="flex space-x-1 items-center">
            <Plus class="w-5 h-5"/>
            <span>
              Creer une recette
            </span>
          </div>
        </Button>
      </Transition>
    </teleport>
  
  
    <BottomSheet v-model="show">
      <NewRecipeForm @close="toggleSheet" @added="handleAdd"/>
    </BottomSheet>
  </Page>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import Button from '../components/Button.vue';
import BottomSheet from '../components/BottomSheet.vue';
import { Plus } from 'lucide-vue-next';
import type { RecipeListType } from '../types/RecipeListType';
import useRecipeService from '../composables/useRecipeService';
import RecipeListItem from '../components/RecipeListItem.vue';
import NewRecipeForm from '../components/NewRecipeForm.vue';
import Page from '../components/Page.vue';
import EmptyPage from '../components/EmptyPage.vue';

const show = ref(false);
const isLoading = ref(false);
const recipeLists = ref<RecipeListType[]>([]);
const selectedList = ref<RecipeListType[]>([]);


const hasSelectedList = computed(() => {
  return selectedList.value.length > 0;
});

const numberOfSelectedLists = computed(() => {
  return selectedList.value.length;
});

function isSelected(list: RecipeListType) {
  return selectedList.value?.find(item => item.id === list.id) ? true : false;
}

function handleSelect(list: RecipeListType) {
  if (selectedList.value?.find(l => l.id === list.id)) {
    selectedList.value = selectedList.value.filter(item => item.id !== list.id);
  } else {
    selectedList.value?.push(list);
  }
}

onBeforeMount(async() => {
  isLoading.value = true;
  recipeLists.value = await useRecipeService().fetchRecipeLists();
  isLoading.value = false;
})

const toggleSheet = () => {
  show.value = !show.value;
};


async function handleAdd(payload: Partial<RecipeListType>) {;
  const newGroceryList = await useRecipeService().postRecipeList(payload);
  if (!newGroceryList) {
    isLoading.value = false;
    return;
  }

  recipeLists.value.push(newGroceryList);
  toggleSheet()
}


async function handleDelete(id: number) {
  await useRecipeService().deleteRecipeList(id)
  .then(() => {
    recipeLists.value = recipeLists.value.filter(list => list.id !== id);
  })
  .catch(error => {
    console.error('Error deleting grocery list:', error);
  });
}

async function handleDeleteAll() {
  if (hasSelectedList.value) {
    await useRecipeService().deleteMultipleLists(selectedList.value.map(list => list.id))
    .then(() => {
      recipeLists.value = recipeLists.value.filter(list => !selectedList.value.find(l => l.id === list.id));
      selectedList.value = [];
    })
    .catch(error => {
      console.error('Error deleting selected grocery lists:', error);
    });
  }
}

</script>