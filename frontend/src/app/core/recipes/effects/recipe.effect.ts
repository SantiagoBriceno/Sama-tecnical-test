import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  addCollaborator,
  addCollaboratorFailure,
  addCollaboratorSuccess,
  createRecipe,
  createRecipeFailure,
  createRecipeSuccess,
  loadMyRecipes,
  loadMyRecipesSuccess,
  loadRecipe,
  loadRecipeFailure,
  loadRecipes,
  loadRecipesSuccess,
  loadRecipeSuccess,
} from '../store/recipe.action';
import { RecipeService } from '../services/recipe.service';
import { catchError, map, mergeMap, of, tap } from 'rxjs';

@Injectable()
export class RecipeEffect {
  private actions$ = inject(Actions);
  private recipeService = inject(RecipeService);
  private router = inject(Router);

  createRecipe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createRecipe),
      mergeMap(({ recipe }) =>
        this.recipeService.createRecipe(recipe).pipe(
          map((response) => {
            return createRecipeSuccess({ recipe: response.newRecipe });
          }),
          catchError((error) => {
            return of(createRecipeFailure({ error }));
          }),
        ),
      ),
    ),
  );

  createRecipeSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createRecipeSuccess),
        map(() => {
          // Modulo de notificaciones puede ser agregado aqui
          this.router.navigate(['/recipes']);
        }),
      ),
    { dispatch: false },
  );

  getRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRecipes),
      mergeMap(() =>
        this.recipeService.getRecipes().pipe(
          map((response) => {
            return loadRecipesSuccess({ recipes: response.data });
          }),
          catchError((error) => {
            return of(createRecipeFailure({ error }));
          }),
        ),
      ),
    ),
  );

  getMyRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMyRecipes),
      mergeMap(() =>
        this.recipeService.getMyPaginatedRecipes().pipe(
          map((response) => {
            return loadMyRecipesSuccess({
              recipes: response.data.myRecipes,
              collaborated: response.data.collaboratedRecipes,
            });
          }),
          catchError((error) => {
            return of(createRecipeFailure({ error }));
          }),
        ),
      ),
    ),
  );

  getRecipeById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRecipe),
      mergeMap(({ recipeId }) =>
        this.recipeService.getRecipeById(recipeId).pipe(
          map((response) => {
            return loadRecipeSuccess({ recipe: response.data });
          }),
          catchError((error) => {
            return of(loadRecipeFailure({ error }));
          }),
        ),
      ),
    ),
  );

  addCollaborator$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCollaborator),
      mergeMap(({ recipeId }) =>
        this.recipeService.addCollaborator(recipeId).pipe(
          map((response) => {
            return addCollaboratorSuccess({ recipe: response.data });
          }),
          catchError((error) => {
            return of(addCollaboratorFailure({ error }));
          }),
        ),
      ),
    ),
  );
}
