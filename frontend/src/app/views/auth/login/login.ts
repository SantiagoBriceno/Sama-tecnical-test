import { Component, inject, signal } from '@angular/core';
import { FormModule } from '../../../core/modules/form/form.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { login, updateLoginUser } from '../../../core/auth/store/auth.action';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [FormModule, MatCard],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup;
  hide = signal(true);

  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initForm();
    this.subscribeToChanges();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Creamos un metodo para subscribirnos a cambios en tiempos reales de los campos del formulario (De esta forma actualizamos el estado)
  private subscribeToChanges(): void {
    this.loginForm.valueChanges.subscribe((values) => {
      // Values posee el estado actual del formulario en un objeto con clave-valor, perfecta para asignarlo a nuestro store
      // console.log('Cambios en el formulario de login:', values);

      this.store.dispatch(updateLoginUser({ user: values }));
    });
  }

  // Método para el envío final del formulario.
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      console.warn('Formulario inválido. Operación cancelada.');
      return;
    }

    const { username, password } = this.loginForm.value;
    // console.log('Enviando datos al servidor...', { username, password });
    this.store.dispatch(login());
  }

  // Metodo auxiliar para emitir una validación sencilla, puede ser extendido según necesidades y creados en otro archivo de utilidades
  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.hasError('required')) return 'Este campo es obligatorio';
    if (control?.hasError('minlength')) return 'Contenido demasiado corto';
    return '';
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  viewPassword(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.preventDefault();
  }
    
}
