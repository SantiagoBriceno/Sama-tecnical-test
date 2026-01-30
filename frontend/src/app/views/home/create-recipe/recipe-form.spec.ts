import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeForm } from './recipe-form';
import { provideMockStore } from '@ngrx/store/testing';

describe('RecipeForm', () => {
  let component: RecipeForm;
  let fixture: ComponentFixture<RecipeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeForm],
      providers: [provideMockStore()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
