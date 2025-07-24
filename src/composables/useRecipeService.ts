import supabase from "../lib/supabaseClient";
import type { RecipeIngredientType } from "../types/RecipeIngredient";
import type { RecipeListType } from "../types/RecipeListType";
import { fromSupabase } from "../utils/fromSupabase";

export default function useRecipeService() {

  async function fetchRecipeLists(): Promise<RecipeListType[]> {
    const { data, error } = await supabase
      .from('recipe_list')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Erreur Supabase:', error);
      return [];
    }
    return fromSupabase<RecipeListType[]>(data);
  }

  async function postRecipeList(recipe: Partial<RecipeListType>): Promise<RecipeListType | null>   {
    const { data, error } = await supabase
      .from('recipe_list') 
      .insert([recipe])
      .select('*')
      .single();
    if (error) {
      console.error('Erreur lors de la création de la recette:', error);
      return null;
    }
    return fromSupabase<RecipeListType>(data);
  }

  async function deleteRecipeList(recipeId: number): Promise<void> {
    const { error } = await supabase
      .from('recipe_list')
      .delete()
      .eq('id', recipeId);
    if (error) {
      console.error('Erreur lors de la suppression de la recette:', error);
      throw error;
    }
  }

  async function deleteMultipleLists(recipeIds: number[]): Promise<void> {
    const { error } = await supabase
      .from('recipe_list')
      .delete()
      .in('id', recipeIds);
    if (error) {
      console.error('Erreur lors de la suppression des recettes:', error);
      throw error;
    }
  }

  async function fetchRecipeIngredients(recipeId: number): Promise<RecipeIngredientType[]> {
    const { data, error } = await supabase
      .from('recipe_ingredients')
      .select('*')
      .eq('recipe_list_id', recipeId);
    if (error) {
      console.error('Erreur lors de la récupération des ingrédients:', error);
      return [];
    }
    return fromSupabase<RecipeIngredientType[]>(data);
  }

  async function postRecipeIngredient(ingredient: Partial<RecipeIngredientType>): Promise<RecipeIngredientType | null> {
    const { data, error } = await supabase
      .from('recipe_ingredients')
      .insert([ingredient])
      .select('*')
      .single();
    if (error) {
      console.error('Erreur lors de la création de l\'ingrédient:', error);
      return null;
    }
    return fromSupabase<RecipeIngredientType>(data);
  }

  async function deleteMultipleRecipeIngredients(ingredientIds: number[]): Promise<void> {
    const { error } = await supabase
      .from('recipe_ingredients')
      .delete()
      .in('id', ingredientIds);
    if (error) {
      console.error('Erreur lors de la suppression des ingrédients:', error);
      throw error;
    }
  }

  async function fetchSingleRecipedById(id: number): Promise<RecipeListType | null> {
    const { data, error } = await supabase
      .from('recipe_list')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Erreur lors de la récupération de la recette:', error);
      return null;
    }
    return fromSupabase<RecipeListType>(data);
  }

  return {
    postRecipeList,
    fetchRecipeLists,
    deleteRecipeList,
    deleteMultipleLists,
    fetchRecipeIngredients,
    postRecipeIngredient,
    deleteMultipleRecipeIngredients,
    fetchSingleRecipedById,
  }

}