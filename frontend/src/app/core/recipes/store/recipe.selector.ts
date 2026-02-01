import { createSelector } from '@ngrx/store';
import { RecipeState } from '../models/recipe.state';
import { AppState } from '../../../app.state';

export const selectRecipeState = (state: AppState) => state.recipe;

export const selectPublicRecipes = createSelector(
  selectRecipeState,
  (state: RecipeState) => state.publicRecipes,
);

export const selectMyRecipes = createSelector(
  selectRecipeState,
  (state: RecipeState) => state.myRecipes,
);

export const selectCollaboratedRecipes = createSelector(
  selectRecipeState,
  (state: RecipeState) => state.collaboratedRecipes,
);

export const selectSelectedRecipe = createSelector(
  selectRecipeState,
  (state: RecipeState) => state.selectedRecipe,
);

export const selectIsLoading = createSelector(
  selectRecipeState,
  (state: RecipeState) => state.isLoading,
);

export const selectError = createSelector(selectRecipeState, (state: RecipeState) => state.error);
