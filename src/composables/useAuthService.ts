// src/composables/useAuthService.js
import { ref } from 'vue'
import supabase from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

const user = ref<User | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

let isInitialized = false

export function useAuthService() {
  if (!isInitialized) {
    isInitialized = true
    supabase.auth.getSession().then(({ data }) => {
      user.value = data.session?.user || null
      loading.value = false
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user || null
    })
  }

  async function login(email: string, password: string) {
    error.value = null
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) error.value = err.message
    return { data, error: err }
  }

  async function signup(email: string, password: string) {
    error.value = null
    const { data, error: err } = await supabase.auth.signUp({ email, password })
    if (err) error.value = err.message
    return { data, error: err }
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
  }

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout,
  }
}