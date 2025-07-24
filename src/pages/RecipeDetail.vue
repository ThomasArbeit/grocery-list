<template>
  <div class="flex flex-col space-y-4">
    
    <div class="flex items-center space-x-3">
      <ArrowLeft class="w-6 h-6 cursor-pointer" @click="$router.back()"/>
      <h1 class="text-xl font-bold truncate whitespace-nowrap overflow-hidden text-ellipsis py-2">{{ recipe?.title }}</h1>
    </div>

    <Tabs :tabs="tabs">
      <template #ingredients>
        <div class="flex flex-col">
          <h2 class="text-sm font-semibold text-stone-400">{{ recipeIngredients.length }} ingredient(s)</h2>
          <TransitionGroup class="flex flex-col" name="fade" tag="ul">
            <Ingredient
            v-for="(item, i) in recipeIngredients"
            :key="item.id"
            :product="item"
            :class="[{'border-t border-stone-200': i !== 0}]"
            class="cursor-pointer"/>
          </TransitionGroup>
        </div>
      </template>

      <template #instructions>
        <h2 class="text-sm font-semibold text-stone-400">Instructions</h2>
        <!-- <p class="text-stone-600">{{ recipe?.instructions }}</p> -->
      </template>
    </Tabs>


    <teleport to="#page-actions">
      <!-- <TransitionGroup name="fade-bottom" tag="span">
        <Button v-if="hasDoneItems" @click="handleDeleteAll" size="md" outline>
          <div class="flex space-x-1 items-center">
            <span>Supprimer </span>
            <Transition name="fade-number" mode="out-in">
              <span :key="numberOfDoneItems">{{ numberOfDoneItems }}</span>
            </Transition>
          </div>
        </Button>
      </TransitionGroup> -->
      <Button @click="toggleSheet" size="md">+ Ajouter ingredient</Button>
    </teleport>
    
    <BottomSheet v-model="show">
      <NewIngredientForm @close="toggleSheet" @added="handleAdd"/>
    </BottomSheet>
  </div>
</template>

<script lang="ts" setup>
import Button from '../components/Button.vue';
import BottomSheet from '../components/BottomSheet.vue';
import { nextTick, onBeforeMount, ref } from 'vue';
import router from '../router';
import { ArrowLeft } from 'lucide-vue-next';
import type { RecipeListType } from '../types/RecipeListType';
import type { RecipeIngredientType } from '../types/RecipeIngredient';
import useRecipeService from '../composables/useRecipeService';
import Ingredient from '../components/Ingredient.vue';
import NewIngredientForm from '../components/NewIngredientForm.vue';
import Tabs from '../components/Tabs.vue';


const show = ref(false);
const recipe = ref<RecipeListType | null>();
const recipeIngredients = ref<RecipeIngredientType[]>([]); // Adjust type as needed
const tabs = ref([
  { name: 'ingredients', label: 'Ingrédients' },
  { name: 'instructions', label: 'Instructions' },
]);

const toggleSheet = () => {
  show.value = !show.value;
};

async function handleAdd(payload: Partial<RecipeIngredientType>) {
  console.log('handleAdd', payload);
  const newItem = await useRecipeService().postRecipeIngredient(payload);

  if (!newItem) return;
  recipeIngredients.value.push(newItem);
  nextTick(() => {
    toggleSheet(); 
  });
}

async function fetchRecipe() {
  const id = Number(router.currentRoute.value.params.id);
  recipe.value = await useRecipeService().fetchSingleRecipedById(id);
  if (!recipe.value) {
    await router.push({ name: 'Home' });
  }
}

async function fetchRecipeIngredients() {
  const id = Number(router.currentRoute.value.params.id);
  recipeIngredients.value = await useRecipeService().fetchRecipeIngredients(id);
}


onBeforeMount(async() => {
  await fetchRecipe();
  await fetchRecipeIngredients();
});
</script>