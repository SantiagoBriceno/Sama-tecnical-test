import { Recipe } from "../../recipes/types/recipe";

export interface CollabState {
  isConnected: boolean;
  currentRecipeId: string | null;
  recipeToEdit: Recipe | null;
  usersInRoom: string[];
  isLoading: boolean;
  error: string | null;
}

export const initialCollabState: CollabState = {
  isConnected: false,
  currentRecipeId: null,
  recipeToEdit: null,
  usersInRoom: [],
  isLoading: false,
  error: null,
};