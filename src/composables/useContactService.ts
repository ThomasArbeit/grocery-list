import supabase from "../lib/supabaseClient"
import type { ContactType } from "../types/ContactType"
import { fromSupabase } from "../utils/fromSupabase"
import { useNotif } from "./useNotif"

export default function useContactService() {
  async function createContact(contact: Partial<ContactType>) {
    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        full_name: contact.fullName,
        contact_id: contact.id,
        avatar_id: contact.avatarId,
      }])
      .select('*')
      .single()
    if (error) {
      console.error('Error creating contact:', error)
      return null
    }
    return fromSupabase<ContactType>(data)
  }

  async function getUserContacts(userId: string): Promise<ContactType[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
    if (error) {
      console.error('Error fetching contacts:', error)
      return []
    }
    return fromSupabase<ContactType[]>(data);
  }

  async function deleteContact(contactId: number) {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactId)
    if (error) {
      console.error('Error deleting contact:', error)
      useNotif().show(`Erreur lors de la suppression du contact, ${error.message} `)
      return null
    }
    return true
  }



  return {
    createContact,
    getUserContacts,
    deleteContact,
  }
}