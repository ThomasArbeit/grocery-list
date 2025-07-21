<template>
  <div class="flex flex-col h-[100%] justify-center bg-gray-100">
    <h1 class="text-2xl font-bold mb-4">Sign In</h1>
    <form class="w-full max-w-sm">
      <div class="mb-4">
       <Input v-model="email"
       label="E-mail"
       placeholder="john.doe@mail.com"/>
      </div>
      <div class="mb-6">
        <Input v-model="password"
        type="password"
        label="Mot de passe"
        placeholder="123456789"/>
      </div>
      <Button size="md" class="w-full">Sign In</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Input from '../components/Input.vue';
import Button from '../components/Button.vue';
const email = ref('');
const password = ref('');
</script>