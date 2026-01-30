import { ActionReducerMap } from '@ngrx/store';
import { AuthState } from './core/auth/models/auth.state';
import { authReducer } from './core/auth/store/auth.reducer';
import { RecipeState } from './core/recipes/models/recipe.state';
import { recipeReducer } from './core/recipes/store/recipe.reducer';
import { CollabState } from './core/collab/models/collab.state';
import { collabReducer } from './core/collab/store/collab.reducer';

export interface AppState {
  auth: AuthState;
  recipe: RecipeState;
  collab: CollabState
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  auth: authReducer,
  recipe: recipeReducer,
  collab: collabReducer
};
