<template>
  <div class="flex flex-col space-y-4 relative">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold">Liste des utilisateurs</h2>
      <X @click="emit('close')"/>
    </div>
    <div class="flex flex-col">
      <ContactSelectItem v-for="(user, i) in users" 
      @select="emit('select', $event)"
      :key="user.avatarId" 
      selectable 
      :user="user" 
      :class="[{'border-t border-stone-200': i !== 0}]"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { X } from 'lucide-vue-next';
import { useUserService } from '../composables/useUserService';
import { useAuthService } from '../composables/useAuthService';
import ContactSelectItem from './ContactSelectItem.vue';
import type { UserType } from '../types/UserType';
import type { ContactType } from '../types/ContactType';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'select', payload: ContactType): void;
}>();

const self = useAuthService().user;
const users = ref<UserType[]>();

onBeforeMount(async () => {
  if(!self.value) {
    console.error('User not authenticated');
    return;
  }
  users.value = await useUserService().getAllUsersExceptCurrent(self.value.id);
});
</script>