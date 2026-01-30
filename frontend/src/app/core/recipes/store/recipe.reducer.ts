import { createReducer, on } from '@ngrx/store';
import * as recipeActions from './recipe.action';
import { initialRecipeState } from '../models/recipe.state';

export const recipeReducer = createReducer(
  initialRecipeState,
  on(recipeActions.loadRecipes, (state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  }),
  on(recipeActions.loadRecipesSuccess, (state, { recipes }) => {
    return {
      ...state,
      publicRecipes: recipes,
      isLoading: false,
      error: null,
    };
  }),
  on(recipeActions.loadRecipesFailure, (state, { error }) => {
    return {
      ...state,
      isLoading: false,
      error,
    };
  }),
  on(recipeActions.loadMyRecipes, (state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  }),
  on(recipeActions.loadMyRecipesSuccess, (state, { recipes }) => {
    return {
      ...state,
      myRecipes: recipes,
      isLoading: false,
      error: null,
    };
  }),
  on(recipeActions.loadMyRecipesFailure, (state, { error }) => {
    return {
      ...state,
      isLoading: false,
      error,
    };
  }),
  on(recipeActions.loadRecipe, (state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  }),
  on(recipeActions.loadRecipeSuccess, (state, { recipe }) => {
    return {
      ...state,
      selectedRecipe: recipe,
      isLoading: false,
      error: null,
    };
  }),
  on(recipeActions.loadRecipeFailure, (state, { error }) => {
    return {
      ...state,
      isLoading: false,
      error,
    };
  }),  
  on(recipeActions.clearSelectedRecipe, (state) => {
    return {
      ...state,
      selectedRecipe: null,
    };
  }),
  on(recipeActions.createRecipe, (state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  }),
  on(recipeActions.createRecipeSuccess, (state, { recipe }) => {
    return {
      ...state,
      isLoading: false,
      error: null,
    };
  }),
  on(recipeActions.createRecipeFailure, (state, { error }) => {
    return {
      ...state,
      isLoading: false,
      error,
    };
  }),
  on(recipeActions.addCollaborator, (state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  }),
  on(recipeActions.addCollaboratorSuccess, (state, {recipe}) => {
    return {
      ...state,
      selectedRecipe: recipe ? recipe : state.selectedRecipe,
      isLoading: false,
      error: null,
    };
  }),
);
