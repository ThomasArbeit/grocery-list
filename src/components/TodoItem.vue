<template>
  <li class="flex justify-between items-center py-4 transition-colors duration-200"
  @click.stop="handleToggleDone">
    <div class="flex items-center space-x-3">
      <span class="rounded-lg w-6 h-6 flex items-center justify-center transition-colors duration-200 cursor-pointer"
      :class="[`${todo.done ? 'bg-green-50 text-green-600 border border-green-600' : 'border border-stone-400 bg-stone-50'}`]">
        <CheckIcon v-if="todo.done" class="w-4 h-4"/>
      </span>
      <span class="font-semibold transition-colors duration-200"
      :class="[{'text-stone-400 line-through' : todo.done}]">{{ todo.name }}</span>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { CheckIcon } from 'lucide-vue-next';
import { nextTick } from 'vue';
import type { TodoType } from '../types/TodoType';
import useTodoService from '../composables/useTodoService';
  const props = defineProps<{
    todo: TodoType
  }>();

  const emit = defineEmits<{
    (e: 'toggle', done: boolean): void;
  }>();

  async function handleToggleDone() {
    await useTodoService().toggleTodoItemDone(props.todo.id, !props.todo.done);
    nextTick(() => {
      props.todo.done = !props.todo.done;
      emit('toggle', props.todo.done);
    });
  }
</script>