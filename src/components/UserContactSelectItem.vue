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

    <Icon
    @click="handleClick"
    class="w-6 h-6 cursor-pointer transition-color duration-200" 
    :class="{'text-emerald-500': user.isContact, 'text-stone-500': !user.isContact}"
    :name="(user.isContact) ? 'CircleCheck' : 'PlusCircle'"/>

  </div>
</template>

<script lang="ts" setup>
import Icon from './Icon.vue';
import { useNotif } from '../composables/useNotif';
import useContactService from '../composables/useContactService';
import type { ContactType } from '../types/ContactType';
import type { UserContactType } from '../types/UserContactType';

const props = defineProps<{
  user: UserContactType;
}>();

const emit = defineEmits<{
  (e: 'select', payload: ContactType): void,
  (e: 'delete', payload: UserContactType): void,
}>();


const handleClick = async () => {
  if (props.user.isContact) {
    const contact = await useContactService().deleteContact(props.user.contactTableId || 0);
    props.user.isContact = !props.user.isContact;
    if (!contact) {
      useNotif().show('Erreur lors de la suppression du contact');
      return;
    }
    emit('delete', props.user);
    useNotif().show('Contact retiré avec succès');
    return;

  } else {
    const contact = await useContactService().createContact(props.user);
    props.user.isContact = !props.user.isContact;
    if (!contact) {
      useNotif().show('Erreur lors de l\'ajout du contact');
      return;
    }
    emit('select', contact);
    useNotif().show('Contact ' + (props.user.isContact ? 'ajouté' : 'retiré') + ' avec succès');
  }
};
</script>