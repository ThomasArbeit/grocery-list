<template>
  <div class="flex flex-col justify-center space-y-4 w-full max-w-md mx-auto p-4 pt-17">
    <img src="../assets/mask.png" alt="" class="absolute -top-20 left-0 z-0">
    <div class="z-1 relative flex flex-col justify-center items-center w-full mb-6">
      <img src="../assets/pwa-192x192.png" alt="Logo" class="w-16 h-16 mb-4 rounded-2xl border-1 border-stone-200">
      <h1 class="text-2xl font-bold">Inscrivez-vous</h1>
      <h2 class="text-stone-600">Ravi de vous voir parmi nous</h2>
    </div>
    <div class="relative z-1 flex flex-col space-y-4">

      <div class="w-full">
        <Input v-model="name"
        ref="nameInput"
        label="Nom"
        placeholder="John Doe"/>
      </div>

      <div class="w-full">
        <Input v-model="email"
        ref="emailInput"
        label="E-mail"
        placeholder="john.doe@mail.com"/>
      </div>

      <div class="w-full">
        <Input v-model="password"
        type="password"
        label="Mot de passe"
        placeholder="123456789"/>
      </div>

      <div class="w-full text-sm text-right font-semibold mb-6">
        <!-- <a href="#" class="text-violet-700 hover:underline">Mot de passe oublié ?</a> -->
      </div>

      <Button size="md" class="w-full" @click="handleSignUp">S'inscrire</Button>
      <Button outline size="md" class="w-full">
        <span class="flex items-center space-x-2">
          <img src="../assets/google.png" alt="" class="w-5 h-5">
          <p>S'inscrire avec Google</p>
        </span>
      </Button>

      <div class="w-full text-sm text-center font-semibold py-6">
        Pas encore de compte ? <RouterLink to="/signin" class="text-violet-700 hover:underline">Connectez-vous</RouterLink>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Input from '../components/Input.vue';
import Button from '../components/Button.vue';
import { useAuthService } from '../composables/useAuthService';
import { useNotif } from '../composables/useNotif';
import router from '../router';

const isLoading = ref(false);
const auth = useAuthService();
const name = ref('');
const email = ref('');
const password = ref('');
const emailInput = ref<HTMLInputElement | null>(null);

async function handleSignUp() {
  if (!email.value || !password.value) {
    useNotif().show('Veuillez remplir tous les champs');
    return;
  }
  isLoading.value = true;
  const {error} = await auth.signup(email.value, password.value, name.value);
  isLoading.value = false;
  if (error) {
    useNotif().show(error.message);
  } else {
    useNotif().show('Inscription réussie');
    router.push('/');
  }
}

onMounted(() => {
  // Focus the email input when the component is mounted
  if (emailInput.value) {
    emailInput.value
  }
});
</script>