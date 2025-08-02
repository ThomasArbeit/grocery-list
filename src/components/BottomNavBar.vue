<script setup lang="ts">
import { BookOpen, Home, ListChecks, ShoppingBasket, User } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import useScrollDirection from '../composables/useScrollDirection';

const { isScrollingDown } = useScrollDirection();
const route = useRoute();
</script>

<template>
  <nav
    class="flex space-x-3 bg-white p-4 fixed bottom-0 left-0 right-0 w-full justify-around transition-transform duration-300 z-40 border-t border-stone-200"
    :class="{ 'translate-y-full': isScrollingDown }"
  >
    <div id="page-actions" class="fixed flex space-x-2 justify-end -left-3 -right-3 bottom-18 px-4 z-40"></div>

    <router-link
      to="/"
      class="text-stone-400 hover:text-stone-900"
      :class="{ 'text-stone-900': route.path === '/' }"
    >
      <Home class="w-6 h-6 inline-block" />
    </router-link>

    <router-link
      to="/todo"
      class="text-stone-400 hover:text-stone-900"
      :class="{ 'text-stone-900': route.path === '/todo' }"
    >
      <ListChecks class="w-6 h-6 inline-block" />
    </router-link>

    <router-link
      to="/recipe"
      class="text-stone-400 hover:text-stone-900"
      :class="{ 'text-stone-900': route.path === '/recipe' }"
    >
      <BookOpen class="w-6 h-6 inline-block" />
    </router-link>

    <router-link
      to="/grocery"
      class="text-stone-400 hover:text-stone-900"
      :class="{ 'text-stone-900': route.path === '/grocery' }"
    >
      <ShoppingBasket class="w-6 h-6 inline-block" />
    </router-link>

    <router-link
      to="/user"
      class="text-stone-400 hover:text-stone-900"
      :class="{ 'text-stone-900': route.path === '/user' }"
    >
      <User class="w-6 h-6 inline-block" />
    </router-link>
  </nav>
</template>
