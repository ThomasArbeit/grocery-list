<template>
  <div class="flex items-center justify-between">
    <div class="flex space-x-4 py-4">
      <img :src="`/avatars/avatar${user.avatarId}.png`" alt="User Avatar" class="w-10 h-10 rounded-full">
      <div>
        <span class="font-semibold">{{ user.fullName }}</span>
        <div class="text-sm text-gray-500">
          Membre depuis {{ new Date(user.createdAt).toLocaleDateString() }}
        </div>
      </div>
    </div>

    <Icon v-if="selectable"
    @click="handleClick"
    class="w-6 h-6 cursor-pointer transition-color duration-200" 
    :class="{'text-emerald-500': isAdded, 'text-stone-500': !isAdded}"
    :name="(selectable && isAdded) ? 'CircleCheck' : 'PlusCircle'"/>

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Icon from './Icon.vue';
import { useNotif } from '../composables/useNotif';
import useContactService from '../composables/useContactService';
import type { ContactType } from '../types/ContactType';
import type { UserType } from '../types/UserType';

const props = defineProps<{
  user: UserType;
  selectable?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', payload: ContactType): void;
}>();

const isAdded = ref(false);

const handleClick = async () => {
  isAdded.value = !isAdded.value;
  const contact = await useContactService().createContact(props.user);
  if (!contact) {
    useNotif().show('Erreur lors de l\'ajout du contact');
    return;
  }
  emit('select', contact);
  useNotif().show('Contact ' + (isAdded.value ? 'ajouté' : 'retiré') + ' avec succès');
};
</script>