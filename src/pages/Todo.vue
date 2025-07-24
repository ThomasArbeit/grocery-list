<template>
  <div class="flex flex-col space-y-4">
    <div class="flex items-center space-x-3">
      <h1 class="text-xl font-bold py-2">Vos listes de taches</h1>
    </div>

    <TransitionGroup name="fade" tag="ul" class="flex flex-col space-y-4">
      <li v-for="list in groupAndSortByDoneStatus" :key="list.name" class="flex flex-col" >
        <h2 class="text-sm font-semibold text-stone-400">{{ list.name }}</h2>
        <TransitionGroup class="flex flex-col" name="fade" tag="ul">
          <TodoListItem
            v-for="(l, i) in list.list"
            v-longpress="() => handleSelect(l)"
            :key="l.id"
            :list="l"
            :style="{ transitionDelay: `${i * 50}ms` }"
            :class="{'border-t border-stone-200': i !== 0}"
            :selecting="hasSelectedList"
            :selected="isSelected(l)"
            @select="handleSelect(l)"
          />
        </TransitionGroup>
      </li>
    </TransitionGroup>

    <teleport to="#page-actions">
      <Button v-if="hasSelectedList" @click="handleDeleteAll" size="md" outline>
          <div class="flex space-x-1 items-center">
            <span>Supprimer </span>
            <Transition name="fade-number" mode="out-in">
              <span :key="numberOfSelectedLists">{{ numberOfSelectedLists }}</span>
            </Transition>
          </div>
        </Button>
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
import { computed, onMounted, ref } from 'vue';
import Button from '../components/Button.vue';
import BottomSheet from '../components/BottomSheet.vue';
import NewListForm from '../components/NewListForm.vue';
import { Plus } from 'lucide-vue-next';
import type { TodoListType } from '../types/TodoListType';
import useTodoService from '../composables/useTodoService';
import TodoListItem from '../components/TodoListItem.vue';

const show = ref(false);
const todoLists = ref<TodoListType[]>([]);
const selectedList = ref<TodoListType[]>([]);

onMounted(async () => {
  todoLists.value = await useTodoService().fetchTodoLists();
});

const toggleSheet = () => {
  show.value = !show.value;
};

const hasSelectedList = computed(() => {
  return selectedList.value.length > 0;
});

const numberOfSelectedLists = computed(() => {
  return selectedList.value.length;
});

function isSelected(list: TodoListType) {
  return selectedList.value?.find(item => item.id === list.id) ? true : false;
}

function handleSelect(list: TodoListType) {
  if (selectedList.value?.find(l => l.id === list.id)) {
    selectedList.value = selectedList.value.filter(item => item.id !== list.id);
  } else {
    selectedList.value?.push(list);
  }
}

const groupAndSortByDoneStatus = computed(() => {
  const grouped = todoLists.value.reduce(
    (acc: { done: TodoListType[]; todo: TodoListType[] }, list) => {
      const key = list.done ? 'done' : 'todo';
      acc[key].push(list);
      return acc;
    },
    { done: [], todo: [] }
  );

  const returnArray = []
  if (grouped.todo.length > 0) {
    returnArray.push({ name: 'todo', list: grouped.todo });
  }
  if (grouped.done.length > 0) {
    returnArray.push({ name: 'done', list: grouped.done });
  }

  return returnArray
});

async function handleAdd (payload: Partial<TodoListType>) {
  const newTodoList = await useTodoService().postTodoList(payload);
  if (!newTodoList) {
    return;
  }
  todoLists.value.push(newTodoList);
  toggleSheet();
};

async function handleDeleteAll() {
  if (hasSelectedList.value) {
    await useTodoService().deleteMultipleLists(selectedList.value.map(list => list.id))
    .then(() => {
      todoLists.value = todoLists.value.filter(list => !selectedList.value.find(l => l.id === list.id));
      selectedList.value = [];
    })
    .catch(error => {
      console.error('Error deleting selected todo lists:', error);
    });
  }
}

</script>