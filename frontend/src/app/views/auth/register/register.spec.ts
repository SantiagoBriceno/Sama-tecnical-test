import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Register } from './register';
import { provideMockStore } from '@ngrx/store/testing';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideMockStore()]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe marcar el formulario como invalido si las contraseñas no coinciden', () => {
    component.registerForm.patchValue({
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password456',
    });

    expect(component.registerForm.hasError('passwordMismatch')).toBeTruthy();
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('debe retornar "Las contraseñas no coinciden" cuando el validador falla', () => {
    component.registerForm.patchValue({
      password: '123',
      confirmPassword: '456',
    });

    // Forzamos la validación
    const error = component.getErrorMessage('confirmPassword');

    expect(error).toBe('Las contraseñas no coinciden');
  });
});
