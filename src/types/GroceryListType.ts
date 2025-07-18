import type { GroceryType } from "./GroceryType";

export type GroceryListType = {
  id: string,
  title: string,
  items: GroceryType[],
}