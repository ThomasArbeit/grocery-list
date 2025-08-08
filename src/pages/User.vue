<template>
  <Page title="Profile">
    <template #actions>
      <Pencil class="w-6 h-6 cursor-pointer"/>
    </template>

    <div class="w-full rounded-2xl flex flex-col items-center justify-center  relative py-8 -z-0">
      <img class="absolute w-100" src="../assets/mask2.png" alt="">
      <div class="flex flex-col space-y-2 space-y-2relative z-10 items-center">
        <img class="w-24 h-24 border-4 border-white rounded-full shadow-lg" :src="`/avatars/avatar${user?.avatarId}.png`" alt="">
        <div class="flex flex-col">
          <h2 class="text-2xl font-bold text-center">{{ user?.fullName }}</h2>
          <p class="text-sm text-stone-500 text-center">
            Membre depuis {{ new Date(user?.createdAt || '').toLocaleDateString() }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-col relative z-10">
      <TransitionGroup class="flex flex-col" name="fade" tag="ul">
      <h2 class="text-sm font-semibold text-stone-400">Mon compte</h2>
      
      <RouterLink to="/user/contacts" class="flex justify-between items-center py-4">
        <div class="flex items-center space-x-4">
          <Users class="w-5 h-5"/>
          <span class="font-semibold">
            Mes contacts
          </span>
        </div>
        <ChevronRight class="text-stone-700 w-5 h-5"/>
      </RouterLink>
      
      <div class="flex justify-between items-center py-4 border-t border-stone-200">
        <div class="flex items-center space-x-4">
          <User class="w-5 h-5"/>
          <span class="font-semibold">
            Mon compte
          </span>
        </div>
        <ChevronRight class="text-stone-700 w-5 h-5"/>
      </div>

      <RouterLink to="Contacts" class="flex justify-between items-center py-4 border-t border-stone-200">
        <div class="flex items-center space-x-4">
          <Bell class="w-5 h-5"/>
          <span class="font-semibold">
            Notifications
          </span>
        </div>
        <ChevronRight class="text-stone-700 w-5 h-5"/>
      </RouterLink>


      <div class="flex justify-between items-center py-4 border-t border-stone-200">
        <div class="flex items-center space-x-4">
          <ChartPie class="w-5 h-5"/>
          <span class="font-semibold">
            Statistiques
          </span>
        </div>
        <ChevronRight class="text-stone-700 w-5 h-5"/>
      </div>

      <div class="flex justify-between items-center py-4 border-t border-stone-200">
        <div class="flex items-center space-x-4">
          <Settings2 class="w-5 h-5"/>
          <span class="font-semibold">
            Parametres
          </span>
        </div>
        <ChevronRight class="text-stone-700 w-5 h-5"/>
      </div>

      <div class="flex justify-between items-center py-4 border-t border-stone-200">
        <div class="flex items-center space-x-4 text-red-500">
          <LogOut class="w-5 h-5"/>
          <span class="font-semibold">
            Se deconnecter
          </span>
        </div>
        <!-- <ChevronRight class="text-stone-700 w-5 h-5"/> -->
      </div>
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
import { Bell, ChartPie, ChevronRight, LogOut, Pencil, Settings2, User, Users } from 'lucide-vue-next';
import type { UserType } from '../types/UserType';

const user = ref<UserType | null>(null);
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
});
</script>
