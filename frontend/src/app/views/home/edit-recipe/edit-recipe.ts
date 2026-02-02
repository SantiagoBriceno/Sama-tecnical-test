import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormModule } from '../../../core/modules/form/form.module';
import { Recipe, RecipeDetails } from '../../../core/recipes/types/recipe';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { A11yModule } from '@angular/cdk/a11y';
import { debounceTime } from 'rxjs';
import {
  disconnect,
  joinRoom,
  leaveRoom,
  recipeChanged,
  setInputBlur,
  setInputFocus,
} from '../../../core/collab/store/collab.action';
import { selectInputsOccupied, selectRecipeToEdit, selectUsersInRoom } from '../../../core/collab/store/collab.selector';
import { selectUsername } from '../../../core/auth/store/auth.selector';
import { selectSelectedRecipe } from '../../../core/recipes/store/recipe.selector';
import { InputRecipeFields } from '../../../core/collab/types/collab';

@Component({
  selector: 'app-recipe-edition',
  imports: [FormModule, A11yModule],
  templateUrl: './edit-recipe.html',
  styleUrl: './edit-recipe.scss',
})
export class EditRecipe {
  private readonly router = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  recipeForm: FormGroup;
  // instanciamos a receta seleccionada inicialmente
  public forEditRecipe = this.store.selectSignal<Recipe | null>(selectRecipeToEdit);
  public selectedRecipe = this.store.selectSignal<RecipeDetails | null>(selectSelectedRecipe);
  public inputsOccupied = this.store.selectSignal<Record<InputRecipeFields, string>>(selectInputsOccupied);
  public collaborators = this.store.selectSignal(selectUsersInRoom);
  public currentUser = this.store.selectSignal(selectUsername);
  units = ['gr', 'ml', 'taza', 'unidad', 'kg'];

  public paramId: string | null = null;

  constructor() {
    this.recipeForm = this.fb.group({
      title: [''],
      description: [''],
      ingredients: this.fb.array([]),
      steps: this.fb.array([]),
    });
    effect(() => {
      const recipe = this.forEditRecipe();
      if (recipe) {
        this.recipeForm.patchValue(
          {
            title: recipe.title,
            description: recipe.description,
          },
          { emitEvent: false },
        );
        this.updateFormArrays(recipe);
        this.updateFieldsStatus(this.inputsOccupied());
      }
    });
  }

  ngOnInit() {
    this.paramId = this.router.snapshot.paramMap.get('id');
    this.store.dispatch(joinRoom({ recipeId: this.paramId || '' }));
    this.formConfig();
  }

  ngOnDestroy() {
    this.store.dispatch(leaveRoom({ recipeId: this.paramId || '' }));
  }

  private formConfig() {
    Object.keys(this.recipeForm.controls).forEach((key) => {
      const control = this.recipeForm.get(key);
      if (control) {
        // Forma avanzada, hacerlo campo por campo con debounce para evitar demasiadas emisiones y hacerlo de forma especifica para cada campo.
        control.valueChanges.pipe(debounceTime(500)).subscribe((newValue) => {
          this.store.dispatch(
            recipeChanged({
              recipeId: this.paramId || '',
              changes: { [key]: newValue },
            }),
          );
        });

        // Por cada control, debemos detectar si algun otro usuario está editándolo para deshabilitar el campo. TENEMOS QUE MEJORAR ESTO.
        // if (this.activeEditors()[key]) {
        //   this.isFieldDisabled(key);
        // }
      }
    });
  }

  private updateFormArrays(recipe: Recipe) {
    const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;

    if (recipe.ingredients.length !== ingredientsArray.length) {
      ingredientsArray.clear({ emitEvent: false });
      recipe.ingredients.forEach((ingredient) => {
        const ingredientForm = this.fb.group({
          name: [ingredient.name],
          quantity: [ingredient.quantity],
          unit: [ingredient.unit],
        });
        ingredientsArray.push(ingredientForm, { emitEvent: false });
      });
    } else {
      ingredientsArray.patchValue(recipe.ingredients, { emitEvent: false });
    }

    const stepsArray = this.recipeForm.get('steps') as FormArray;
    if (recipe.steps.length !== stepsArray.length) {
      stepsArray.clear({ emitEvent: false });
      recipe.steps.forEach((step) => {
        const stepForm = this.fb.group({
          instruction: [step.instruction],
          stepNumber: [step.stepNumber],
        });
        stepsArray.push(stepForm, { emitEvent: false });
      });
    } else {
      stepsArray.patchValue(recipe.steps, { emitEvent: false });
    }
  }

  private updateFieldsStatus(occupied: Record<InputRecipeFields, string>) {
    Object.keys(this.recipeForm.controls).forEach((key) => {
      const field = key as InputRecipeFields;
      const control = this.recipeForm.get(field);
      
      const occupantId = occupied[field];
      // Si hay alguien y no soy yo -> Deshabilitar
      const isLockedByOther = occupantId && occupantId !== this.currentUser();

      if (isLockedByOther) {
        control?.disable({ emitEvent: false }); // emitEvent: false para evitar bucles infinitos
      } else {
        control?.enable({ emitEvent: false });
      }
    });
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get steps() {
    return this.recipeForm.get('steps') as FormArray;
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  addStep() {
    const stepForm = this.fb.group({
      instruction: [''],
      stepNumber: [this.steps.length + 1],
    });
    this.steps.push(stepForm);
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  addIngredient() {
    const ingredientForm = this.fb.group({
      name: [''],
      quantity: [''],
      unit: [''],
    });
    this.ingredients.push(ingredientForm);
  }

  // Funcion para emitir cuando se hace focus en un campo, indicando que el usuario está editando ese campo.
  onFieldFocus(fieldName: InputRecipeFields) {
    this.store.dispatch(setInputFocus({ recipeId: this.paramId || '', inputId: fieldName }));
  }

  // Funcion para emitir cuando se pierde el focus en un campo, indicando que el usuario ha dejado de editar ese campo.
  onFieldBlur(fieldName: InputRecipeFields) {
    this.store.dispatch(setInputBlur({ recipeId: this.paramId || '', inputId: fieldName }));
  }

  // Función para hacer que un input este deshabilitado si otro usuario está editándolo (actualmente no se usa)
  isFieldDisabled(fieldName: string) {
    const editor = this.activeEditors()[fieldName];
    const currentUser = this.currentUser();

    this.recipeForm.get(fieldName)?.disable();
  }

  // Otra cosa
  activeEditors = signal<Record<string, string>>({
    title: 'JuanLog99',
    'ingredient-0': 'Maria_Chef', // Ejemplo de alguien editando el primer ingrediente
  });

  // Identificar quién está en el campo
  getEditorOf(field: InputRecipeFields): string | null {
    return this.inputsOccupied()[field] || null;
  }
}
