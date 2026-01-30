import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRecipe } from './edit-recipe';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';

describe('EditRecipe', () => {
  let component: EditRecipe;
  let fixture: ComponentFixture<EditRecipe>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRecipe],
      providers: [
        provideMockStore({
          initialState: {
            collab: {
              recipeToEdit: null,
            },
          },
        }),
        provideRouter([{ path: 'edit-recipe/:id', component: EditRecipe }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditRecipe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
