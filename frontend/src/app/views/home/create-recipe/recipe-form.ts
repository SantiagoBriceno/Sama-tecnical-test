import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormModule } from '../../../core/modules/form/form.module';
import { Store } from '@ngrx/store';
import { createRecipe } from '../../../core/recipes/store/recipe.action';
import { RecipePreview } from '../components/recipe-preview/recipe-preview';

@Component({
  selector: 'app-recipe-form',
  imports: [FormModule, RecipePreview],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.scss',
})
export class RecipeForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  recipeForm: FormGroup;
  units = ['gr', 'ml', 'taza', 'unidad', 'kg'];

  constructor() {
    this.recipeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      ingredients: this.fb.array([]),
      steps: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.addIngredient();
    this.addStep();
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get steps() {
    return this.recipeForm.get('steps') as FormArray;
  }

  addIngredient() {
    const ingredientForm = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      unit: ['', Validators.required],
    });
    this.ingredients.push(ingredientForm);
  }

  addStep() {
    const stepForm = this.fb.group({
      instruction: ['', Validators.required],
      stepNumber: [this.steps.length + 1, Validators.required],
    });
    this.steps.push(stepForm);
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  onSubmit() {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      console.warn('Formulario inválido. Operación cancelada.');
      return;
    }
    this.store.dispatch(createRecipe({ recipe: this.recipeForm.value }));
    // console.log('Recipe Submitted', this.recipeForm.value);
  }
}
