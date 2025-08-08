<template>
  <div class="flex space-x-4 py-4">
    <img :src="`/avatars/avatar${contact.avatarId}.png`" alt="contact Avatar" class="w-10 h-10 rounded-full">
    <div>
      <span class="font-semibold">{{ contact.fullName }}</span>
      <div class="text-sm text-gray-500">
        Ajouté le {{ new Date(contact.createdAt).toLocaleDateString() }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ContactType } from '../types/ContactType';

defineProps<{
  contact: ContactType
}>();

</script>