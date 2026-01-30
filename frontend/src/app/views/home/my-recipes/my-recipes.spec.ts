import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRecipes } from './my-recipes';
import { provideMockStore } from '@ngrx/store/testing';

describe('MyRecipes', () => {
  let component: MyRecipes;
  let fixture: ComponentFixture<MyRecipes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRecipes],
      providers: [provideMockStore({
        initialState: {
          recipe: {
            publicRecipes: [],
            myRecipes: [],
          }
        },
      })],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRecipes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
