<template>
  <Page title="Profile">
    <template #actions>
      <Pencil class="w-6 h-6 cursor-pointer" @click="handleEditClick()"/>
    </template>

    <div class="w-full select-none pointer-events-none rounded-2xl flex flex-col items-center justify-center  relative py-8 -z-0">
      <img class="absolute w-100" src="../assets/mask2.png" alt="">
      <div class="flex flex-col space-y-2 space-y-2relative z-10 items-center">
        <img class="w-24 h-24 border-4 border-white rounded-full shadow-lg" :src="`/avatars/big-avatar${user?.avatarId}.png`" alt="">
        <div class="flex flex-col">
          <h2 class="text-2xl font-bold text-center">{{ user?.fullName }}</h2>
          <p class="text-sm text-stone-500 text-center">
            Membre depuis {{ new Date(user?.createdAt || '').toLocaleDateString() }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-col z-10">
      <h2 :key="'Mon compte'" class="text-sm font-semibold text-stone-400">Mon compte</h2>
      <TransitionGroup class="flex flex-col" name="fade" tag="div">

        <RouterLink v-for="(link, index) in links" 
        :key="link.id" 
        :to="link.to" 
        class="flex justify-between items-center py-4" 
        :class="{'border-t border-stone-200': index !== 0}"
        :style="{ transitionDelay: `${link.delay * 50}ms` }">
          <div class="flex items-center space-x-4">
            <Icon :name="link.icon" class="w-5 h-5"/>
            <span class="font-semibold">{{ link.label }}</span>
          </div>
          <ChevronRight class="text-stone-700 w-5 h-5"/>
        </RouterLink>

      </TransitionGroup>

    </div>

    <!-- <teleport to="#page-actions">
      <Button @click="useAuthService().logout" size="md">
        Se deconnecter
      </Button>
    </teleport> -->
  </Page>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import Page from '../components/Page.vue';
import { useAuthService } from '../composables/useAuthService';
import { useUserService } from '../composables/useUserService';
import type { UserType } from '../types/UserType';
import Icon from '../components/Icon.vue';
import { ChevronRight, LogOut, Pencil } from 'lucide-vue-next';
import { useNotif } from '../composables/useNotif';

const user = ref<UserType | null>(null);
const links = ref();

const handleEditClick = () => {
  useNotif().show('Cette fonctionnalité n\'est pas encore implémentée');
}

onBeforeMount(async() => {
  const userService = useUserService();
  const userId = useAuthService().user.value?.id;
  if (!userId) {
    console.error('No user ID found');
    return;
  }
  user.value = await userService.getUserProfile(userId);
  if (!user.value) {
    console.error('User profile not found');
  }
  links.value = [
    { id: 1, label: 'Mes contacts', icon: 'Users', to: '/user/contacts', delay: 0 },
    { id: 2, label: 'Mon compte', icon: 'User', to: '/grocery-lists', delay: 1 },
    { id: 3, label: 'Notifications', icon: 'Bell', to: '/todos', delay: 2 },
    { id: 4, label: 'Statistiques', icon: 'ChartPie', to: '/recipes', delay: 3 },
    { id: 5, label: 'Parametres', icon: 'Settings2', to: '/user/settings', delay: 4 },
    { id: 6, label: 'Se deconnecter', icon: 'LogOut', to: '/login', delay: 5 }
  ]
});
</script>
