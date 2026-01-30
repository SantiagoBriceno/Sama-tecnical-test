import { createAction, props } from '@ngrx/store';
import { Recipe, RecipeDetails, RecipeSummary } from '../types/recipe';

export const loadRecipes = createAction('[Recipe] Load Recipes');

export const loadRecipesSuccess = createAction(
  '[Recipe] Load Recipes Success',
  props<{ recipes: RecipeSummary[] }>()
);

export const loadRecipesFailure = createAction(
  '[Recipe] Load Recipes Failure',
  props<{ error: any }>()
);

export const loadMyRecipes = createAction('[Recipe] Load My Recipes');

export const loadMyRecipesSuccess = createAction(
  '[Recipe] Load My Recipes Success',
  props<{ recipes: RecipeSummary[] }>()
);

export const loadMyRecipesFailure = createAction(
  '[Recipe] Load My Recipes Failure',
  props<{ error: any }>()
);

export const loadRecipe = createAction(
  '[Recipe] Load Recipe',
  props<{ recipeId: string }>()
);
export const loadRecipeSuccess = createAction(
  '[Recipe] Load Recipe Success',
  props<{ recipe: RecipeDetails }>()
);
export const loadRecipeFailure = createAction(
  '[Recipe] Load Recipe Failure',
  props<{ error: any }>()
);

export const clearSelectedRecipe = createAction('[Recipe] Clear Selected Recipe');

export const createRecipe = createAction(
  '[Recipe] Create Recipe',
  props<{ recipe: Recipe }>()
);

export const createRecipeSuccess = createAction(
  '[Recipe] Create Recipe Success',
  props<{ recipe: Recipe }>()
);

export const createRecipeFailure = createAction(
  '[Recipe] Create Recipe Failure',
  props<{ error: any }>()
);

export const addCollaborator = createAction(
  '[Recipe] Add Collaborator',
  props<{ recipeId: string }>()
);

export const addCollaboratorSuccess = createAction(
  '[Recipe] Add Collaborator Success',
  props<{ recipe: RecipeDetails | null }>()
);

export const addCollaboratorFailure = createAction(
  '[Recipe] Add Collaborator Failure',
  props<{ error: any }>()
);
