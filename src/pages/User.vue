<template>
  <Page title="Mon Profil">

    <!-- <EmptyPage
      title="Aucune info"
      description="Vous pouvez  créer votre profil en cliquant sur le bouton ci-dessous."
      icon="User"/> -->

    <div class="flex flex-col">
      <RouterLink to="/user/contacts" class="flex justify-between items-center py-4">
        <div class="flex items-center space-x-4">
          <Users class="w-5 h-5"/>
          <span class="font-semibold">
            Mes contacts
          </span>
        </div>
        <ChevronRight class="text-stone-700 w-5 h-5"/>
      </RouterLink>

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
          <Settings2 class="w-5 h-5"/>
          <span class="font-semibold">
            Parametres
          </span>
        </div>
        <ChevronRight class="text-stone-700 w-5 h-5"/>
      </div>

    </div>

    <teleport to="#page-actions">
      <Button @click="useAuthService().logout" size="md">
        Se deconnecter
      </Button>
    </teleport>
  </Page>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import Button from '../components/Button.vue';
// import EmptyPage from '../components/EmptyPage.vue';
import Page from '../components/Page.vue';
import { useAuthService } from '../composables/useAuthService';
import { useUserService } from '../composables/useUserService';
import { Bell, ChevronRight, Settings2, Users } from 'lucide-vue-next';
const user = ref(null);
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
