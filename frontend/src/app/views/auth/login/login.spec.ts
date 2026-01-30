import { ComponentFixture, TestBed } from '@angular/core/testing';
import {provideMockStore, MockStore} from '@ngrx/store/testing';
import { Login } from './login';
import { login } from '../../../core/auth/store/auth.action';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideMockStore()]

    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;

    store = TestBed.inject(MockStore);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('debería crear el componente Login', () => {
    expect(component).toBeTruthy();
  });

  it('Should be dispatch login action if form is valid', () => {
    // Hacemos seguimiento al método dispatch del Store
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    // Rellenamos el formulario con datos válidos
    component.loginForm.setValue({
      username: 'testuser',
      password: 'password123'
    });

    // Disparamos la acción de login
    component.onLogin();

    // Verificamos que se haya llamado al dispatch con la acción de login
    expect(dispatchSpy).toHaveBeenCalledWith(login());
  });
});
