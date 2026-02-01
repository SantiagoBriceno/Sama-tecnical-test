import { Recipe } from '../../recipes/types/recipe';
import { InputRecipeFields } from '../types/collab';

export interface CollabState {
  isConnected: boolean;
  currentRecipeId: string | null;
  recipeToEdit: Recipe | null;
  inputsOccupied: Record<InputRecipeFields, string> ; // inputId -> userId
  usersInRoom: string[];
  isLoading: boolean;
  error: string | null;
}

export const initialCollabState: CollabState = {
  isConnected: false,
  currentRecipeId: null,
  recipeToEdit: null,
  inputsOccupied: {
    title: '',
    description: '',
    ingredients: '',
    steps: '',
  },
  usersInRoom: [],
  isLoading: false,
  error: null,
};
