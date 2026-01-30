import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FormModule } from '../../../core/modules/form/form.module';
import { Store } from '@ngrx/store';
import { register } from '../../../core/auth/store/auth.action';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-register',
  imports: [FormModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group(
      {
        username: [''],
        password: [''],
        confirmPassword: [''],
      },
      { validators: passwordMatchValidator },
    );
  }

  private subscribeToChanges(): void {
    this.registerForm.valueChanges.subscribe((value) => {
      console.log('Form changes', value);
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.store.dispatch(
      register({
        newUser: {
          ...this.registerForm.value,
        },
      }),
    );
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control?.hasError('required')) return 'Este campo es obligatorio';
    if (control?.hasError('minlength')) return 'Mínimo 6 caracteres';
    if (this.registerForm.hasError('passwordMismatch') && controlName === 'confirmPassword') {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }
}
