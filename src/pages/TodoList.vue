<template>
  <div class="flex flex-col space-y-4">
    
    <div class="flex items-center space-x-3">
      <ArrowLeft class="w-6 h-6 cursor-pointer" @click="$router.back()"/>
      <h1 class="text-xl font-bold truncate whitespace-nowrap overflow-hidden text-ellipsis py-2">{{ todoList?.title }}</h1>
    </div>

    <div class="flex flex-col">
      <h2 class="text-sm font-semibold text-stone-400">{{ todoItems.length }} taches</h2>
      <TransitionGroup class="flex flex-col" name="fade" tag="ul">
        <TodoItem
        v-for="(item, i) in todoItems"
        :key="item.id"
        :todo="item"
        :class="[{'border-t border-stone-200': i !== 0}]"
        class="cursor-pointer"
        @toggle="handleToggle"/>
      </TransitionGroup>
    </div>

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
      <NewTodoItemForm @close="toggleSheet" @added="handleAdd"/>
    </BottomSheet>
  </div>
</template>

<script lang="ts" setup>
import Button from '../components/Button.vue';
import BottomSheet from '../components/BottomSheet.vue';
import { computed, nextTick, onBeforeMount, ref } from 'vue';
import router from '../router';
import type { TodoListType } from '../types/TodoListType';
import useTodoService from '../composables/useTodoService';
import type { TodoType } from '../types/TodoType';
import TodoItem from '../components/TodoItem.vue';
import NewTodoItemForm from '../components/NewTodoItemForm.vue';
import { ArrowLeft } from 'lucide-vue-next';


const show = ref(false);
const todoList = ref<TodoListType | null>();
const todoItems = ref<TodoType[]>([]); // Adjust type as needed

const numberOfDoneItems = computed(() => {
  return todoItems.value.filter(item => item.done).length;
});
const hasDoneItems = computed(() => {
  return todoItems.value.some(item => item.done);
});

const toggleSheet = () => {
  show.value = !show.value;
};

async function handleDeleteAll() {
  if (hasDoneItems.value) {
    await useTodoService().deleteMultipleItemsFromList(todoList.value?.id || 0, todoItems.value.filter(item => item.done).map(item => item.id))
    .then(() => {
      todoItems.value = todoItems.value.filter(item => !item.done);
    })
  }
}

async function handleAdd(payload: Partial<TodoType>) {
  const newItem = await useTodoService().postTodoItem(payload);
  if (todoList.value?.done) {
    await useTodoService().putDoneTodoListById(todoList.value?.id || 0, false);
    todoList.value!.done = false;
  }
  if (!newItem) return;
  todoItems.value.push(newItem);
  nextTick(() => {
    toggleSheet(); 
  });
}

async function fetchTodoList() {
  const id = Number(router.currentRoute.value.params.id);
  todoList.value = await useTodoService().fetchTodoListById(id);
  if (!todoList.value) {
    await router.push({ name: 'Home' });
  }
}

async function fetchTodoItems() {
  const id = Number(router.currentRoute.value.params.id);
  todoItems.value = await useTodoService().fetchTodoListItemsByListId(id);
}

async function handleToggle() {
  await useTodoService().putDoneTodoListById(todoList.value?.id || 0, numberOfDoneItems.value === todoItems.value.length ? true : false);
  todoList.value!.done = !todoList.value!.done;
}

onBeforeMount(async() => {
  await fetchTodoList();
  await fetchTodoItems();
});
</script>