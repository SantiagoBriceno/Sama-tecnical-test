import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Recipe, RecipeDetails, RecipeSummary } from '../types/recipe';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly apiUrl: string = environment.apiUrl + '/recipes';

  constructor(private readonly http: HttpClient) {}

  createRecipe(recipeData: Recipe): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, recipeData);
  }

  getRecipes(): Observable<{ data: RecipeSummary[]; meta: any }> {
    return this.http.get<any>(`${this.apiUrl}/all`);
  }

  getMyRecipes(): Observable<{ data: RecipeSummary[]; meta: any }> {
    return this.http.get<any>(`${this.apiUrl}/my-recipes`);
  }

  getPaginatedRecipes(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/paginated?page=${page}&limit=${limit}`);
  }

  getMyPaginatedRecipes(page: number = 1, limit: number = 10): Observable<{data: {
    myRecipes: RecipeSummary[];
    collaboratedRecipes: RecipeSummary[]
  }}> {
    return this.http.get<any>(`${this.apiUrl}/paginated/my-recipes?page=${page}&limit=${limit}`);
  }

  getRecipeById(recipeId: string): Observable<{data: RecipeDetails}> {
    return this.http.get<{data: RecipeDetails}>(`${this.apiUrl}/by/${recipeId}`);
  }

  addCollaborator(recipeId: string): Observable<{data: RecipeDetails | null}> {
    return this.http.post<{data: RecipeDetails | null}>(`${this.apiUrl}/collaborate/${recipeId}`, {});
  }
}
