import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipePreview } from './recipe-preview';
import { provideMockStore } from '@ngrx/store/testing';

describe('RecipePreview', () => {
  let component: RecipePreview;
  let fixture: ComponentFixture<RecipePreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipePreview],
      providers: [provideMockStore()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipePreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
