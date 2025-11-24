export type GroceryViewMode = "byRecipe" | "combined";

export type RawQuantity = number | string;

export type GroceryIngredient = {
  id: string;
  name: string;
  quantity: RawQuantity; // ⬅️ now supports "1/2", "3/4", etc.
  unit: string;
};

export type GroceryRecipe = {
  id: string;
  title: string;
  ingredients: GroceryIngredient[];
};

export type CombinedIngredient = {
  name: string;
  unit: string;
  totalQuantity: number;
  recipes: {
    recipeId: string;
    title: string;
    quantity: number; // numeric value (parsed)
    rawQuantity: string; // original, for display if you want
    unit: string;
  }[];
};
