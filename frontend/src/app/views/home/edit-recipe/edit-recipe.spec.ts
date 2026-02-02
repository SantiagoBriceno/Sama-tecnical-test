import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRecipe } from './edit-recipe';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

describe('EditRecipe', () => {
  let component: EditRecipe;
  let fixture: ComponentFixture<EditRecipe>;
  let store: MockStore;
  let initialState = {
    recipe: {
      selectedRecipe: null,
    },
    collab: {
      recipeToEdit: null,
      inputsOccupied: {},
      usersInRoom: [],
    },
    auth: {
      username: 'testUser',
    },
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRecipe],
      providers: [
        provideMockStore({ initialState }),
        provideRouter([{ path: 'edit-recipe/:id', component: EditRecipe }]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => {
                  return 'edit-recipe/123';
                },
              },
            },
          },
        }
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
