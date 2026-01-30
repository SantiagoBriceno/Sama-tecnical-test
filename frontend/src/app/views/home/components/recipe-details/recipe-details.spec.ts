import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeDetails } from './recipe-details';
import { provideMockStore } from '@ngrx/store/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('RecipeDetails', () => {
  let component: RecipeDetails;
  let fixture: ComponentFixture<RecipeDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeDetails],
      providers: [
        provideMockStore({
          initialState: {
            recipe: {
              selectedRecipe: null,
            },
          },
        }),
        {
          provide: MAT_DIALOG_DATA,
          useValue: { recipeId: 'test-recipe-id', name: 'Test Recipe' },
        },
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
