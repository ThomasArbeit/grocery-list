<script setup lang="ts">
import { UserPlus } from 'lucide-vue-next';
// import EmptyPage from '../components/EmptyPage.vue';
import Page from '../components/Page.vue';
import Button from '../components/Button.vue';
import { ref } from 'vue';
import UserTag from '../components/UserTag.vue';

const users = ref([
  {
    avatarUrl: 22,
    fullName: 'Thomas Arbeit',
    createdAt: '05/01/2023',
  },
  {
    avatarUrl: 23,
    fullName: 'Alice Dupont',
    createdAt: '06/15/2023',
  },
  {
    avatarUrl: 24,
    fullName: 'Jean Valjean',
    createdAt: '07/20/2023',
  },
  {
    avatarUrl: 25,
    fullName: 'Marie Curie',
    createdAt: '08/30/2023',
  },
  {
    avatarUrl: 22,
    fullName: 'Thomas Arbeit',
    createdAt: '05/01/2023',
  },
  {
    avatarUrl: 23,
    fullName: 'Alice Dupont',
    createdAt: '06/15/2023',
  },
  {
    avatarUrl: 24,
    fullName: 'Jean Valjean',
    createdAt: '07/20/2023',
  },
  {
    avatarUrl: 25,
    fullName: 'Marie Curie',
    createdAt: '08/30/2023',
  },
  {
    avatarUrl: 22,
    fullName: 'Thomas Arbeit',
    createdAt: '05/01/2023',
  },
  {
    avatarUrl: 23,
    fullName: 'Alice Dupont',
    createdAt: '06/15/2023',
  },
  {
    avatarUrl: 24,
    fullName: 'Jean Valjean',
    createdAt: '07/20/2023',
  },
  {
    avatarUrl: 25,
    fullName: 'Marie Curie',
    createdAt: '08/30/2023',
  },

]);

</script>

<template>
  <Page title="Contacts">
    <!-- <EmptyPage
      title="Aucun contact"
      description="Vous n'avez pas encore de contacts. Ajoutez-en pour les retrouver ici."
      icon="Users"/> -->
    
    <div class="flex flex-col">

      <h2 class="text-sm font-semibold text-stone-400">{{ users.length }} contact(s)</h2>
      <UserTag v-for="(user, index) in users" :user="user" :key="user.avatarUrl" :class="{'border-t border-stone-200': index !== 0, }"/>
    </div>

    <teleport to="#page-actions">
      <Button @click="" size="md">
        <UserPlus class="w-5 h-5 mr-2"/>
        <span>Ajouter un contact</span>
      </Button>
    </teleport>

  </Page>
</template>

