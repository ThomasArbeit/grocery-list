<template>
  <div class="flex flex-col space-y-4">
    <h1 class="text-xl font-bold mb-6">Vos listes de taches</h1>

    <div class="flex flex-col space-y-4">
      <div class="flex flex-col">
        <h2 class="text-sm font-semibold text-stone-400">{{ groupAndSortByDoneStatus.todo.length }} A faire</h2>
        <TransitionGroup class="relative flex flex-col align-center" name="fade" tag="ul">
          <TodoListItem
            v-for="(list, i) in groupAndSortByDoneStatus.todo"
            :key="list.id"
            :list="list"
            :style="{ transitionDelay: `${i * 50}ms` }"
            :class="{'border-t border-stone-200': i !== 0}"
          />
        </TransitionGroup>
      </div>

      <div class="flex flex-col">
        <h2 class="text-sm font-semibold text-stone-400">{{ groupAndSortByDoneStatus.done.length }} finie(s)</h2>
        <TransitionGroup class="relative flex flex-col align-center" name="fade" tag="ul">
          <TodoListItem
            v-for="(list, i) in groupAndSortByDoneStatus.done"
            :key="list.id"
            :list="list"
            :style="{ transitionDelay: `${i * 50}ms` }"
            :class="{'border-t border-stone-200': i !== 0}"
          />
        </TransitionGroup>
      </div>
    </div>

    <teleport to="#page-actions">
        <Button @click="toggleSheet" size="md" >
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

const todoLists = ref<TodoListType[]>([]);
const show = ref(false);

onMounted(async () => {
  todoLists.value = await useTodoService().fetchTodoLists();
});

const toggleSheet = () => {
  show.value = !show.value;
};

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
</script>