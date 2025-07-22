import type { GroceryListType } from "../types/GroceryListType";
import supabase from '../lib/supabaseClient';
import { fromSupabase } from "../utils/fromSupabase";
import type { GroceryType } from "../types/GroceryType";

export default function useGroceryService() {

  async function fetchGroceryLists(): Promise<GroceryListType[]> {
    const { data, error } = await supabase
      .from('grocery_lists')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur Supabase:', error)
      return []
    }

    return fromSupabase<GroceryListType[]>(data);
  }

  async function postGroceryList(list: Partial<GroceryListType>): Promise<GroceryListType | null> {
    const { data, error } = await supabase
      .from('grocery_lists')
      .insert([list])
      .select('*')
      .single();
    if (error) {
      console.error('Erreur lors de la création de la liste:', error);
      return null;
    }
    return fromSupabase<GroceryListType>(data);
  }

  async function deleteGroceryList(listId: number): Promise<void> {
    const { error } = await supabase
      .from('grocery_lists')
      .delete()
      .eq('id', listId);
    if (error) {
      console.error('Erreur lors de la suppression de la liste:', error);
      throw error;
    }
  }

  async function fetchGroceryListById(id: number): Promise<GroceryListType | null> {
    const { data, error } = await supabase
      .from('grocery_lists')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Erreur lors de la récupération de la liste:', error);
      return null;
    }
    return fromSupabase<GroceryListType>(data);
  }

  async function fetchGroceryListItemsByListId(listId: number): Promise<GroceryType[]> {
    const { data, error } = await supabase
      .from('grocery_list_items')
      .select('*')
      .eq('grocery_list_id', listId)
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Erreur lors de la récupération des items de la liste:', error);
      return [];
    }
    return fromSupabase<any[]>(data);
  }

  async function postGroceryListItem(item: Partial<GroceryType>): Promise<GroceryType | null> {
    const { data, error } = await supabase
      .from('grocery_list_items')
      .insert([item])
      .select('*')
      .single();
    if (error) {
      console.error('Erreur lors de la création de l\'item:', error);
      return null;
    }
    return fromSupabase<GroceryType>(data);
  }

  async function putDoneStatus(itemId: number, done: boolean): Promise<GroceryType | null> {
    const { data, error } = await supabase
      .from('grocery_list_items')
      .update({ done })
      .eq('id', itemId)
      .select('*')
      .single();
    if (error) {
      console.error('Erreur lors de la mise à jour du statut de l\'item:', error);
      return null;
    }
    return fromSupabase<GroceryType>(data);
  }

  async function deleteMultipleItemsFromList(listId: number, itemIds: number[]): Promise<void> {
    const { error } = await supabase
      .from('grocery_list_items')
      .delete()
      .in('id', itemIds)
      .eq('grocery_list_id', listId);
    if (error) {
      console.error('Erreur lors de la suppression des items:', error);
      throw error;
    }
  }

  async function deleteMultipleLists(listIds: number[]): Promise<void> {
    const { error } = await supabase
      .from('grocery_lists')
      .delete()
      .in('id', listIds);
    if (error) {
      console.error('Erreur lors de la suppression des listes:', error);
      throw error;
    }
  }

  return {
    fetchGroceryLists,
    postGroceryList,
    deleteGroceryList,
    fetchGroceryListById,
    fetchGroceryListItemsByListId,
    postGroceryListItem,
    putDoneStatus,
    deleteMultipleItemsFromList,
    deleteMultipleLists
  }
}