<template>
  <div class="flex flex-col space-y-4">
    <h1 class="text-xl font-bold mb-6">Vos listes de taches</h1>

    <div class="flex flex-col space-y-4">
      <div class="flex flex-col">
        <h2 class="text-sm font-semibold text-stone-400">{{ groupAndSortByDoneStatus.todo.length }} a faire</h2>
        <TransitionGroup class="relative flex flex-col align-center" name="fade" tag="ul">
          <TodoListItem
          v-for="(list, i) in groupAndSortByDoneStatus.todo"
          v-longpress="() => handleSelect(list)"
            :key="list.id"
            :list="list"
            :style="{ transitionDelay: `${i * 50}ms` }"
            :class="{'border-t border-stone-200': i !== 0}"
            :selecting="hasSelectedList"
            :selected="isSelected(list)"
            @select="handleSelect(list)"
          />
        </TransitionGroup>
      </div>

      <div class="flex flex-col">
        <h2 class="text-sm font-semibold text-stone-400">{{ groupAndSortByDoneStatus.done.length }} finie(s)</h2>
        <TransitionGroup class="relative flex flex-col align-center" name="fade" tag="ul">
          <TodoListItem
            v-for="(list, i) in groupAndSortByDoneStatus.done"
            v-longpress="() => handleSelect(list)"
            :key="list.id"
            :list="list"
            :style="{ transitionDelay: `${i * 50}ms` }"
            :class="{'border-t border-stone-200': i !== 0}"
            :selecting="hasSelectedList"
            :selected="isSelected(list)"
            @select="handleSelect(list)"
          />
        </TransitionGroup>
      </div>
    </div>

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
  return todoLists.value.reduce((acc: { done: TodoListType[]; todo: TodoListType[] }, list) => {
    const key = list.done ? 'done' : 'todo';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(list);
    return acc;
  }, { todo: [], done: [] });
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