<template>
  <div class="flex flex-col space-y-4 relative">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold">Liste des utilisateurs</h2>
      <X @click="emit('close')"/>
    </div>
    <!-- <pre>{{ users }}</pre> -->
    <div class="flex flex-col">
      <ContactSelectItem v-for="(user, i) in users" 
      @select="emit('select', $event)"
      @delete="emit('delete', $event)"
      :key="user.avatarId" 
      selectable 
      :user="user" 
      :class="[{'border-t border-stone-200': i !== 0}]"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { X } from 'lucide-vue-next';
import { useAuthService } from '../composables/useAuthService';
import ContactSelectItem from './ContactSelectItem.vue';
import type { ContactType } from '../types/ContactType';
import type { UserContactType } from '../types/UserContactType';
import useGroceryService from '../composables/useGroceryService';
import router from '../router';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'select', payload: ContactType): void;
  (e: 'delete', payload: UserContactType): void;
}>();

const self = useAuthService().user;
const users = ref();

onMounted(async () => {
  if(!self.value) {
    console.error('User not authenticated');
    return;
  }
  users.value = await useGroceryService().getUsersContactsInList(Number(router.currentRoute.value.params.id), self.value.id);
});
</script>