<template>
  <Tabs :tabs="tabs">
    <template #home>
      <div class="text-center text-lg">🏠 Accueil</div>
    </template>
    <template #search>
      <div class="text-center text-lg">🔍 Rechercher</div>
    </template>
    <template #profile>
      <div class="text-center text-lg">👤 Profil</div>
    </template>
  </Tabs>
</template>

<script setup lang="ts">
import Tabs from '../components/Tabs.vue';


const tabs = [
  { name: 'home', label: 'Accueil' },
  { name: 'search', label: 'Recherche' },
  { name: 'profile', label: 'Profil' },
]
</script>
