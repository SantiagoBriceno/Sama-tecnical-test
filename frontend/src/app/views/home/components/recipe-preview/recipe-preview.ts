import { Component, inject, Input } from '@angular/core';
import { CardModule } from '../../../../core/modules/card/card.module';
import { Recipe } from '../../../../core/recipes/types/recipe';
import { Store } from '@ngrx/store';
import { selectUsername } from '../../../../core/auth/store/auth.selector';

@Component({
  selector: 'app-recipe-preview',
  imports: [CardModule],
  templateUrl: './recipe-preview.html',
  styleUrl: './recipe-preview.scss',
})
export class RecipePreview {
  private readonly store = inject(Store);
  public user = this.store.selectSignal(selectUsername);

  @Input() recipe: Recipe = {
    title: 'Sample Recipe',
    description: 'This is a sample recipe description.',
    ingredients: [
      {
        name: 'Sample Ingredient',
        quantity: '1',
        unit: 'cup',
      },
    ],
    steps: [
      {
        instruction: 'Sample step instruction.',
        stepNumber: 1,
      },
    ],
  };
}
