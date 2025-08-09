import type { GroceryListType } from "../types/GroceryListType";
import supabase from '../lib/supabaseClient';
import { fromSupabase } from "../utils/fromSupabase";
import type { GroceryType } from "../types/GroceryType";
import { useNotif } from "./useNotif";
import { useAuthService } from "./useAuthService";
import type { UserType } from "../types/UserType";

export default function useGroceryService() {

  async function fetchGroceryLists(): Promise<GroceryListType[]> {
    const { data, error } = await supabase
      .from('grocery_list_users')
      .select('grocery_list_id')
      .eq('user_id', useAuthService().user.value?.id);
    if (error) {
      console.error('Erreur Supabase:', error);
      return [];
    }
    const groceryListIds = data.map(item => item.grocery_list_id);

    if (groceryListIds.length === 0) {
      return [];
    }
    // Fetch grocery lists based on the IDs
    const { data: groceryLists, error: listError } = await supabase
      .from('grocery_lists')
      .select('*')
      .in('id', groceryListIds)
      .order('created_at', { ascending: false });
    if (listError) {
      console.error('Erreur Supabase:', listError);
      return [];
    }
    if (!groceryLists) {
      return [];
    }
    // Convert the data to the correct type
    return fromSupabase<GroceryListType[]>(groceryLists);
  }

  async function postGroceryList(list: Partial<GroceryListType>, currentUserId: string): Promise<GroceryListType | null> {
    const { data: groceryList, error: listError } = await supabase
      .from('grocery_lists')
      .insert([{...list, user_id: currentUserId}])
      .select('*')
      .single();
    if (listError) {
      console.error('Erreur lors de la création de la liste:', listError);
      return null;
    }

    const { error: userLinkError } = await supabase
    .from('grocery_list_users')
    .insert([
      {
        grocery_list_id: groceryList.id,
        user_id: currentUserId,
        role: 'owner'
      }
    ]);

  if (userLinkError) {
    console.error('Erreur lors de l’ajout du créateur à la liste:', userLinkError);
    // ⚠ Ici tu peux choisir : soit retourner null, soit retourner la liste quand même
    return null;
  }

    return fromSupabase<GroceryListType>(groceryList);
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

  async function postMultipleIngredientsToListById(listId: number, ingredients: Partial<GroceryType>[]): Promise<GroceryType[] | null> {

    const ingredientsToAdd = ingredients.map(ingredient => ({ ...ingredient, grocery_list_id: listId }))
    const { data, error } = await supabase
      .from('grocery_list_items')
      .insert(ingredientsToAdd)
      .select('*');
    if (error) {
      console.error('Erreur lors de l\'ajout des ingrédients à la liste:', error);
      return null;
    }
    useNotif().show('Ingrédients ajoutés à la liste', 'success', {label: 'Voir la liste', to: `/grocery/${listId}`});
    return fromSupabase<GroceryType[]>(data);
  }

  async function getUsersFromList(listId: number): Promise<UserType[]> {
    const { data, error } = await supabase
      .from('grocery_list_users')
      .select('user_id')
      .eq('grocery_list_id', listId);
    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs de la liste:', error);
      return [];
    }

    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .in('id', data.map(user => user.user_id));
    if (userError) {
      console.error('Erreur lors de la récupération des utilisateurs:', userError);
      return [];
    }
    return fromSupabase<UserType[]>(users);
  }

  async function getUsersContactsInList(listId: number, currentUserId: string): Promise<UserType[]> {
    const { data: users, error: userError } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', currentUserId)
    if (userError) {
      console.error('Erreur lors de la récupération des utilisateurs:', userError);
      return [];
    }
    
    const { data: groceryUsers, error: groceryError } = await supabase
      .from('grocery_list_users')
      .select('user_id')
      .eq('grocery_list_id', listId)
      .neq('user_id', currentUserId);
    if (groceryError) {
      console.error('Erreur lors de la récupération des contacts de la liste:', groceryError);
      return [];
    }
    const groceryUserIds = new Set(groceryUsers.map(user => user.user_id));

    return users.map(user => ({
      ...fromSupabase(user),
      isInList: groceryUserIds.has(user.contact_id),
      groceryListId: listId,
    }));
  }

  async function addUserToList(listId: number, userId: string): Promise<void> {
    const { error } = await supabase
      .from('grocery_list_users')
      .insert([{ grocery_list_id: listId, user_id: userId, role: 'member', }]);
    if (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur à la liste:', error);
      useNotif().show(`Erreur lors de l'ajout de l'utilisateur à la liste, ${error.message}`, 'error');
      throw error;
    }
    useNotif().show('Utilisateur ajouté à la liste', 'success');
    return;
  }

  async function deleteUserFromList(listId: number, userId: string): Promise<void> {
    const { error } = await supabase
      .from('grocery_list_users')
      .delete()
      .eq('grocery_list_id', listId)
      .eq('user_id', userId);
    if (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur de la liste:', error);
      throw error;
    }
    useNotif().show('Utilisateur supprimé de la liste', 'success');
    return;
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
    deleteMultipleLists,
    postMultipleIngredientsToListById,
    getUsersFromList,
    getUsersContactsInList,
    addUserToList,
    deleteUserFromList
  }
}