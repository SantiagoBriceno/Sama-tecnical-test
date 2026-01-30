import { Component, effect, inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { clearSelectedRecipe, loadMyRecipes, loadRecipe } from '../../../../core/recipes/store/recipe.action';
import { RecipeCard } from '../recipe-card/recipe-card';
import { MatDialog } from '@angular/material/dialog';
import { RecipeDetails } from '../recipe-details/recipe-details';
import { RecipeSummary } from '../../../../core/recipes/types/recipe';

@Component({
  selector: 'app-recipe-list',
  imports: [RecipeCard],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.scss',
  exportAs: 'recipeList',
})
export class RecipeList {
  private readonly store = inject(Store);
  private readonly modal = inject(MatDialog);

  @Input() recipes: RecipeSummary[] = [];

  ngOnInit() {
    this.store.dispatch(loadMyRecipes());
  }

  onClose() {
    // Limpiar la receta seleccionada al cerrar el modal
    // this.store.dispatch(clearSelectedRecipe());
  }

  openRecipeDetails(recipeId: string) {
    this.store.dispatch(loadRecipe({ recipeId }));
    const modalRef = this.modal.open(RecipeDetails, {
      // ESta es una forma de pasar datos al modal sin embargo, podemos usar ngRx para manejar el estado global y saber que receta se esta viendo
      data: { recipeId: recipeId },
    });

    modalRef.afterClosed().subscribe((result) => {
      this.onClose();
    });
  }
}
