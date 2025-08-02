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
import Button from '../components/Button.vue';
import EmptyPage from '../components/EmptyPage.vue';
import Page from '../components/Page.vue';
import { useAuthService } from '../composables/useAuthService';
</script>
