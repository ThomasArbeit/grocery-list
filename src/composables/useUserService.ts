import supabase from '../lib/supabaseClient'
import { fromSupabase } from '../utils/fromSupabase'
import type { UserType } from '../types/UserType'
import type { UserContactType } from '../types/UserContactType'

export function useUserService() {
  async function createUserProfile(id: string, fullName: string) {
    const { error } = await supabase
      .from('users')
      .insert([{ id, full_name: fullName }])
    return { error }
  }

  async function getUserProfile(id: string): Promise<UserType | null>  {
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

  async function getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
    if (error) {
      console.error('Error fetching users:', error)
      return []
    }
    return data.map(fromSupabase)
  }

  async function getAllUsersExceptCurrent(currentUserId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .neq('id', currentUserId)
    if (error) {
      console.error('Error fetching users except current:', error)
      return []
    }
    return data.map(fromSupabase)
  }

  async function getUsersWithContactStatus(currentUserId: string): Promise<UserContactType[]> {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .neq('id', currentUserId)
    if (error) {
      console.error('Error fetching users with contact status:', error)
      return []
    }
    
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('user_id, contact_id, created_at, id')
      .eq('user_id', currentUserId)
    if (contactsError) {
      console.error('Error fetching contacts:', contactsError)
      return []
    }
    const contactIds = new Set(contacts.map(contact => contact.contact_id));
    return users.map(user => ({
      ...fromSupabase(user),
      isContact: contactIds.has(user.id),
      contactTableId: contacts.find(contact => contact.contact_id === user.id)?.id || null,
    }))
  }


  return {
    createUserProfile,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getAllUsers,
    getAllUsersExceptCurrent,
    getUsersWithContactStatus,
  }
}
