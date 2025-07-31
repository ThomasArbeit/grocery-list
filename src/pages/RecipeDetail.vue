<template>
  <Page 
  :title="recipe!.title" 
  :number-of-selected-lists="numberOfSelectedLists">
  <template #actions>
    <Transition name="fade-top" tag="span" mode="out-in">
      <div 
      v-if="hasSelectedList"
      class="h-6 ml-3 w-6 rounded-lg border border-stone-500 flex items-center justify-center cursor-pointer transition-colors duration-200"
      :class="{'bg-stone-900 text-white border-stone-900': numberOfSelectedLists === recipeIngredients.length}" 
      >
        <CheckIcon v-if="numberOfSelectedLists === recipeIngredients.length" class="w-4 h-4 text-white"/>
      </div>
      <ShoppingBasket v-else class="w-6 h-6 text-stone-900" @click="toggleGrocerySelectSheet"/>
    </Transition>
  </template>
    <Tabs :tabs="tabs">
      <template #ingredients>
        <div class="flex flex-col">
          <h2 class="text-sm font-semibold text-stone-400">{{ recipeIngredients.length }} ingredient(s)</h2>
          <TransitionGroup class="flex flex-col" name="fade" tag="ul">
            <Ingredient
              v-for="(item, i) in recipeIngredients"
              v-longpress="() => handleSelect(item)"
              :key="item.id"
              :product="item"
              :class="[{'border-t border-stone-200': i !== 0}]"
              :style="`transition-delay: ${i * 50}ms`"
              :selecting="hasSelectedList"
              :selected="isSelected(item)"
              @select="handleSelect(item)"
              class="cursor-pointer"/>  
          </TransitionGroup>
        </div>
        <teleport to="#page-actions">
          <Transition name="fade-bottom" tag="span" mode="out-in">
            <TransitionGroup v-if="hasSelectedList" name="fade-bottom" tag="div" class="flex space-x-2">
              <Button v-if="numberOfSelectedLists === 1" size="md" outline>
                <div class="flex space-x-1 items-center">
                  <span>Modifier </span>
                </div>
              </Button>
              <Button size="md" outline>
                Supprimer
              </Button>
            </TransitionGroup>
            <Button v-else @click="toggleSheet" size="md">
              <div class="flex space-x-1 items-center">
                <Plus class="w-5 h-5"/>
                <span>
                  Ajouter
                </span>
              </div>
            </Button>
          </Transition>
        </teleport>
      </template>
      
      <!-- <template #instructions>
        <h2 class="text-sm font-semibold text-stone-400">Instructions</h2>
        <teleport to="#page-actions">
          <Transition name="fade-bottom" tag="span" mode="out-in">
            <TransitionGroup v-if="hasSelectedList" name="fade-bottom" tag="div" class="flex space-x-2">
              <Button v-if="numberOfSelectedLists === 1" size="md" outline>
                <div class="flex space-x-1 items-center">
                  <span>Modifier</span>
                </div>
              </Button>
              <Button size="md" outline>
                Supprimer
              </Button>
            </TransitionGroup>
            <Button v-else @click="toggleSheet" size="md" >
              <div class="flex space-x-1 items-center">
                <Plus class="w-5 h-5"/>
                <span>
                  Ajouter
                </span>
              </div>
            </Button>
          </Transition>
        </teleport>
      </template> -->
    </Tabs>
    
    
    <BottomSheet v-model="show">
      <NewIngredientForm @close="toggleSheet" @added="handleAdd"/>
    </BottomSheet>

    <BottomSheet v-model="showGroceryList" :title="'Liste de courses'">
      <GroceryListSelect @close="toggleGrocerySelectSheet" @add="handleAddToGroceryList" v-if="showGroceryList"/>
    </BottomSheet>
    
  </Page>
</template>

<script lang="ts" setup>
import Button from '../components/Button.vue';
import BottomSheet from '../components/BottomSheet.vue';
import { computed, nextTick, onBeforeMount, ref } from 'vue';
import router from '../router';
import type { RecipeListType } from '../types/RecipeListType';
import type { RecipeIngredientType } from '../types/RecipeIngredient';
import useRecipeService from '../composables/useRecipeService';
import Ingredient from '../components/Ingredient.vue';
import NewIngredientForm from '../components/NewIngredientForm.vue';
import Tabs from '../components/Tabs.vue';
import Page from '../components/Page.vue';
import { CheckIcon, Plus, ShoppingBasket } from 'lucide-vue-next';
import GroceryListSelect from '../components/GroceryListSelect.vue';
import useGroceryService from '../composables/useGroceryService';


const show = ref(false);
const showGroceryList = ref(false);

const recipe = ref<RecipeListType | null>();
const recipeIngredients = ref<RecipeIngredientType[]>([]); // Adjust type as needed

const tabs = ref([
  { name: 'ingredients', label: 'Ingrédients' },
  { name: 'instructions', label: 'Instructions' },
]);

const selectedList = ref<RecipeIngredientType[]>([]);

const hasSelectedList = computed(() => {
  return selectedList.value.length > 0;
});

const numberOfSelectedLists = computed(() => {
  return selectedList.value.length;
});

function isSelected(list: RecipeIngredientType) {
  return selectedList.value?.find(item => item.id === list.id) ? true : false;
}

function handleSelect(list: RecipeIngredientType) {
  if (selectedList.value?.find(l => l.id === list.id)) {
    selectedList.value = selectedList.value.filter(item => item.id !== list.id);
  } else {
    selectedList.value?.push(list);
  }
}

const toggleSheet = () => {
  show.value = !show.value;
};

const toggleGrocerySelectSheet = () => {
  showGroceryList.value = !showGroceryList.value;
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

async function handleAddToGroceryList(listId: number) {
  await useGroceryService().postMultipleIngredientsToListById(listId, recipeIngredients.value.map(item => ({
    name: item.name,
    quantity: item.quantity,
    category: item.category,
  })));
}


onBeforeMount(async() => {
  await fetchRecipe();
  await fetchRecipeIngredients();
});
</script>