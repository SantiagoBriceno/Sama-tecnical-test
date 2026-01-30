import { Component, effect, inject, Input } from '@angular/core';
import { ModalModule } from '../../../../core/modules/modal/modal.module';
import { Store } from '@ngrx/store';
import { selectSelectedRecipe } from '../../../../core/recipes/store/recipe.selector';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { addCollaborator } from '../../../../core/recipes/store/recipe.action';
import { connect, setRecipeToEdit } from '../../../../core/collab/store/collab.action';

@Component({
  selector: 'app-recipe-details',
  imports: [ModalModule],
  templateUrl: './recipe-details.html',
  styleUrl: './recipe-details.scss',
})
export class RecipeDetails {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  public readonly data: { recipeId: string } = inject(MAT_DIALOG_DATA);
  public readonly dialogRef = inject(MatDialogRef<RecipeDetails>);

  public recipe = this.store.selectSignal(selectSelectedRecipe);

  constructor() {}

  ngOnInit() {}

  editRecipe() {

    if (this.recipe() === null) {
      return;
    }

    this.store.dispatch(addCollaborator({ recipeId: this.data.recipeId }));
    this.store.dispatch(connect())
    this.store.dispatch(setRecipeToEdit({ recipe: this.recipe()! }));
    this.router.navigate(['/home/recipe', this.data.recipeId]);
    this.dialogRef.close();
  }
}
