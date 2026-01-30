import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardModule } from '../../../../core/modules/card/card.module';
import { Recipe, RecipeSummary } from '../../../../core/recipes/types/recipe';

@Component({
  selector: 'app-recipe-card',
  imports: [CardModule],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.scss',
  exportAs: 'recipeCard',
})
export class RecipeCard {
  @Input() recipe: RecipeSummary = {
    id: '0',
    title: 'Default Recipe',
    description: 'This is a default recipe description.',
    author: {
      credentials: {
        username: 'defaultUser',
      },
      lastLogin: '2024-01-01T00:00:00Z',
    },
    created_at: '2024-01-01T00:00:00Z',
  };
  @Output() viewDetails = new EventEmitter<string>();

  onViewDetails() {
    this.viewDetails.emit(this.recipe.id);
  }
}
