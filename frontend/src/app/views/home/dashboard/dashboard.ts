import { Component, effect, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectPublicRecipes } from '../../../core/recipes/store/recipe.selector';
import { loadRecipes } from '../../../core/recipes/store/recipe.action';
import { RecipeList } from "../components/recipe-list/recipe-list";

@Component({
  selector: 'app-dashboard',
  imports: [RecipeList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly store = inject(Store);
  public recipes = this.store.selectSignal(selectPublicRecipes);

  constructor() {
    effect(() => {});
  }

  ngOnInit() {
    this.store.dispatch(loadRecipes());
  }
}
