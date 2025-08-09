<template>
  <div class="flex items-center justify-between">
    <div class="flex space-x-4 py-4">
      <img :src="`/avatars/avatar${user.avatarId}.png`" alt="User Avatar" class="w-10 h-10 rounded-full">
      <div>
        <span class="font-semibold">{{ user.fullName }}</span>
        <div class="text-sm text-gray-500">
          Membre depuis {{ new Date(user.createdAt).toLocaleDateString() }} {{ user.isInList }}
        </div>
      </div>
    </div>

    <Icon
    @click="handleClick"
    class="w-6 h-6 cursor-pointer transition-color duration-200" 
    :class="{'text-emerald-500': user.isInList, 'text-stone-500': !user.isInList}"
    :name="(user.isInList) ? 'CircleCheck' : 'PlusCircle'"/>

  </div>
</template>

<script lang="ts" setup>
import Icon from './Icon.vue';
import type { ContactType } from '../types/ContactType';

const props = defineProps<{
  user: ContactType & { isInList: boolean; };
}>();

const emit = defineEmits<{
  (e: 'select', payload: any): void,
  (e: 'delete', payload: any): void,
}>();


const handleClick = async () => {
  if(props.user.isInList) {
    emit('delete', props.user);
    props.user.isInList = !props.user.isInList;
  } else {
    emit('select', props.user);
    props.user.isInList = !props.user.isInList;
  }
};
</script>