import { RecipeDetails, RecipeSummary } from "../types/recipe";

export interface RecipeState {
  publicRecipes: RecipeSummary[];
  myRecipes: RecipeSummary[];
  selectedRecipe: RecipeDetails | null;
  isLoading: boolean;
  error: string | null;
}

export const initialRecipeState: RecipeState = {
  publicRecipes: [],
  myRecipes: [],
  selectedRecipe: null,
  isLoading: false,
  error: null,
};