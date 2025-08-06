<template>
  <div class="flex space-x-4 py-4">
    <img :src="`/avatars/avatar${user.avatarUrl}.png`" alt="User Avatar" class="w-10 h-10 rounded-full">
    <div>
      <span class="font-semibold">{{ user.fullName }}</span>
      <div class="text-sm text-gray-500">
        Membre depuis {{ new Date(user.createdAt).toLocaleDateString() }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  user: {
    avatarUrl: number | string;
    fullName: string;
    createdAt: string;
  };
}>();
</script>