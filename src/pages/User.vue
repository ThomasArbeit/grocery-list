<template>
  <Page title="Mon Profil">

    <EmptyPage
      title="Aucune info"
      description="Vous pouvez  créer votre profil en cliquant sur le bouton ci-dessous."
      icon="User"/>

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
import EmptyPage from '../components/EmptyPage.vue';
import Page from '../components/Page.vue';
import { useAuthService } from '../composables/useAuthService';
import { useUserService } from '../composables/useUserService';
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
