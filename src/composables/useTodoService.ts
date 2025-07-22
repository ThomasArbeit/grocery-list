import supabase from "../lib/supabaseClient";
import type { TodoListType } from "../types/TodoListType";
import type { TodoType } from "../types/TodoType";
import { fromSupabase } from "../utils/fromSupabase";

export default function useTodoService() {

  async function fetchTodoLists(): Promise<TodoListType[]> {
    const reponse = await supabase
      .from('todo_list')
      .select("*")
      .order("created_at", { ascending: false })

    if (reponse.error) {
      console.error("Erreur lors de la récupération des listes de tâches:", reponse.error);
      return [];
    }
    return fromSupabase<TodoListType[]>(reponse.data);
  }

  async function postTodoList(todoList: Partial<TodoListType>): Promise<TodoListType | null> {
    const response = await supabase
      .from("todo_list")
      .insert([todoList])
      .select("*")
      .single();
    if (response.error) {
      throw new Error(response.error.message);
    }
    return fromSupabase<TodoListType>(response.data);
  }

  async function deleteTodoList(id: number) {
    const response = await supabase
      .from("todo_list")
      .delete()
      .eq("id", id)
      .select("*")
      .single();
    if (response.error) {
      throw new Error(response.error.message);
    }
    return fromSupabase<TodoListType>(response.data);
  }

  async function fetchTodoListById(id: number): Promise<TodoListType | null> {
    const response = await supabase
      .from("todo_list")
      .select("*")
      .eq("id", id)
      .single();
    if (response.error) {
      console.error("Erreur lors de la récupération de la liste de tâches:", response.error);
      return null;
    }
    return fromSupabase<TodoListType>(response.data);
  }
  
  async function fetchTodoListItemsByListId(listId: number): Promise<TodoType[]> {
    const { data, error } = await supabase
      .from('todo_list_items')
      .select('*')
      .eq('todo_list_id', listId)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Erreur lors de la récupération des items de la liste:', error);
      return [];
    } 
    return fromSupabase<TodoType[]>(data);
  }

  async function postTodoItem(item: Partial<TodoType>): Promise<TodoType | null> {
    const { data, error } = await supabase
      .from('todo_list_items')
      .insert([item])
      .select('*')
      .single();
    if (error) {
      console.error('Erreur lors de la création de l\'item:', error);
      return null;
    }
    return fromSupabase<TodoType>(data);
  }

  async function toggleTodoItemDone(itemId: number, done: boolean): Promise<TodoType | null> {
    const { data, error } = await supabase 
      .from('todo_list_items')
      .update({ done })
      .eq('id', itemId)
      .select('*')
      .single();
    if (error) {
      console.error('Erreur lors de la mise à jour du statut de l\'item:', error);
      return null;
    }
    return fromSupabase<TodoType>(data);
  }

  async function deleteMultipleItemsFromList(listId: number, itemIds: number[]): Promise<void> {
    const { error } = await supabase
      .from('todo_list_items')
      .delete()
      .eq('todo_list_id', listId)
      .in('id', itemIds);
    if (error) {
      console.error('Erreur lors de la suppression des items:', error);
      throw error;
    }
  }

  async function putDoneTodoListById(id: number, done: boolean): Promise<TodoListType | null> {
    const { data, error } = await supabase
      .from('todo_list')
      .update({ done })
      .eq('id', id)
      .select('*')
      .single();
    if (error) {
      console.error('Erreur lors de la mise à jour du statut de la liste:', error);
      return null;
    }
    return fromSupabase<TodoListType>(data);
  }

  return {
    fetchTodoLists,
    postTodoList,
    deleteTodoList,
    fetchTodoListById,
    fetchTodoListItemsByListId,
    postTodoItem,
    toggleTodoItemDone,
    deleteMultipleItemsFromList,
    putDoneTodoListById
  }
}