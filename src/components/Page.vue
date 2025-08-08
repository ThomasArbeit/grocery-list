<template>
  <div class="flex flex-col space-y-4">
    
    <div class="flex justify-between">
      <div class="flex items-center space-x-3 relative z-10">
        <ArrowLeft v-if="isNotHomePage" class="w-6 h-6 cursor-pointer" @click="$router.back"/>
        <Transition name="fade-top" mode="out-in">
          <h1 v-if="numberOfSelectedLists" class="text-xl font-bold py-1">{{ numberOfSelectedLists }} sélectionnés</h1>
          <h1 v-else class="text-xl font-bold py-1">{{ title }}</h1>
        </Transition>
      </div>
      <div class="flex space-x-4 items-center justify-center">
        <slot name="actions"></slot>
      </div>
    </div>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { ArrowLeft } from 'lucide-vue-next';
import { computed } from 'vue';
import router from '../router';
  defineProps({
    title: {
      type: String,
      required: true,
    },
    numberOfSelectedLists: {
      type: Number,
      default: 0,
    },
  });

  const isNotHomePage = computed(() => {
    return router.currentRoute.value.name !== 'Home';
  });
  </script>
