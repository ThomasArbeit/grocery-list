export type RecipeListType = {
  id: number;
  title: string;
  createdAt: string; // ISO date string
  userId: number; // Assuming a user ID is associated with the recipe
}