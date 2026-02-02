import { Component, effect, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadMyRecipes } from '../../../core/recipes/store/recipe.action';
import { selectCollaboratedRecipes, selectMyRecipes } from '../../../core/recipes/store/recipe.selector';
import { RecipeList } from "../components/recipe-list/recipe-list";

@Component({
  selector: 'app-my-recipes',
  imports: [RecipeList],
  templateUrl: './my-recipes.html',
  styleUrl: './my-recipes.scss',
})
export class MyRecipes {
  
  private readonly store = inject(Store);
  public recipes = this.store.selectSignal(selectMyRecipes);
  public collaborated = this.store.selectSignal(selectCollaboratedRecipes);

  constructor() {
    effect(() => {});
  }

  ngOnInit() {
    this.store.dispatch(loadMyRecipes());
  }  
}
