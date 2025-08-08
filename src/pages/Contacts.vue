<script setup lang="ts">
import { UserPlus } from 'lucide-vue-next';
import EmptyPage from '../components/EmptyPage.vue';
import Page from '../components/Page.vue';
import Button from '../components/Button.vue';
import { onBeforeMount, ref } from 'vue';
import BottomSheet from '../components/BottomSheet.vue';
import ContactListSelect from '../components/ContactListSelect.vue';
import type { ContactType } from '../types/ContactType';
import useContactService from '../composables/useContactService';
import { useAuthService } from '../composables/useAuthService';
import ContactItem from '../components/ContactItem.vue';
// import UserTag from '../components/UserTag.vue';

const isLoading = ref(false);
const self = useAuthService().user;
const show = ref(false);
const users = ref<ContactType[]>([]);

onBeforeMount(async () => {
  isLoading.value = true;
  users.value = await useContactService().getUserContacts(self.value?.id || '');
  isLoading.value = false;
});

const handleSelect = (contact: ContactType) => {
  users.value.push(contact);
};

</script>

<template>
  <Page title="Contacts">
    <Transition name="fade-bottom" mode="out-in">
      <EmptyPage v-if="users.length === 0 && !isLoading"
        title="Aucun contact"
        description="Vous n'avez pas encore de contacts. Ajoutez-en pour les retrouver ici."
        icon="Users"/>
  
      <div v-else class="flex flex-col">
        <h2 class="text-sm font-semibold text-stone-400">{{ users.length }} ami(e)(s)</h2>
        <TransitionGroup class="flex flex-col" name="fade" tag="ul">
          <ContactItem v-for="(user, i) in users"
            :key="user.id"
            :contact="user"
            :class="[{'border-t border-stone-200': i !== 0}]"/>
        </TransitionGroup>  
      </div>
      
    </Transition>

    <teleport to="#page-actions">
      <Button @click="show = !show" size="md">
        <UserPlus class="w-5 h-5 mr-2"/>
        <span>Ajouter un contact</span>
      </Button>
    </teleport>

    <BottomSheet v-model="show">
      <ContactListSelect @close="show = false" @select="handleSelect"/>
    </BottomSheet>

  </Page>
</template>

