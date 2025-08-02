import supabase from '../lib/supabaseClient'
import { fromSupabase } from '../utils/fromSupabase'

export function useUserService() {
  async function createUserProfile(id: string, fullName: string) {
    const { error } = await supabase
      .from('users')
      .insert([{ id, full_name: fullName }])
    return { error }
  }

  async function getUserProfile(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    return fromSupabase(data)
  }

  async function updateUserProfile(id: string, data: { fullName?: string }) {
    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', id)
    if (error) {
      console.error('Error updating user profile:', error)
      return null
    }
    return true
  }

  async function deleteUserProfile(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    if (error) {
      console.error('Error deleting user profile:', error)
      return null
    }
    return true
  }

  return {
    createUserProfile,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
  }
}
