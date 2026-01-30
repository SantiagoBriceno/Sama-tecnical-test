import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./views/home/home').then((m) => m.Home),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./views/home/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'recipes',
        loadComponent: () => import('./views/home/my-recipes/my-recipes').then((m) => m.MyRecipes),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./views/home/create-recipe/recipe-form').then((m) => m.RecipeForm),
      },
      {
        path: 'recipe/:id',
        loadComponent: () =>
          import('./views/home/edit-recipe/edit-recipe').then((m) => m.EditRecipe),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./views/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./views/auth/register/register').then((m) => m.Register),
  },
];
