import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  isLoggedIn,
  login,
  loginFailure,
  loginSuccess,
  loginRedirect,
  register,
  registerSuccess,
  registerFailure,
  logout,
  logoutSuccess,
} from '../store/auth.action';
import { catchError, map, mergeMap, of, tap, withLatestFrom } from 'rxjs';
import { selectLoginUser } from '../store/auth.selector';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../../shared/toast/toast';

@Injectable()
export class AuthEffect {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private router = inject(Router);
  private authService = inject(AuthService);
  private notificationService = inject(ToastService);

  // Verifica si el usuario ya está autenticado al iniciar la aplicación para mantener la sesión activa. (Obviamente es muy básico, solo revisa si hay un token en el localStorage).
  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(isLoggedIn),
      map(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token && username) {
          return loginSuccess({ token, username });
        }
        return loginFailure({ error: 'No token found' });
      }),
    ),
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      withLatestFrom(this.store.select(selectLoginUser)),
      mergeMap(([_action, user]) => {
        return this.authService.login(user).pipe(
          map((response) => {
            return loginSuccess({ token: response.accessToken, username: response.username });
          }),
          catchError((error) => {
            this.notificationService.show('Error al iniciar sesión', 'error');
            return of(loginFailure({ error }));
          }),
        );
      }),
    ),
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      map(({ token, username }) => {
        this.notificationService.show('Inicio de sesión exitoso', 'success');
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);

        return loginRedirect();
      }),
    ),
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginFailure),
        tap(({ error }) => {
          this.notificationService.show('Fallo en el inicio de sesión', 'error');
        }),
      ),
    { dispatch: false },
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(register),
      mergeMap(({ newUser }) => {
        return this.authService.register(newUser).pipe(
          map((response) => {
            return registerSuccess({ token: response.accessToken, username: response.username });
          }),
          catchError((error) => {
            return [registerFailure({ error })];
          }),
        );
      }),
    ),
  );

  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerSuccess),
      map(({ token, username }) => {
        this.notificationService.show('Registro exitoso', 'success');
        return loginSuccess({ token, username });
      }),
      catchError(({ error }) => {
        this.notificationService.show('Error en el registro', 'error');
        return of(registerFailure({ error }));
      }),
    ),
  );

  navigateToHome$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginRedirect),
        tap(() => {
          this.router.navigate(['/home']);
        }),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          localStorage.removeItem('token');
          this.store.dispatch(logoutSuccess());
          this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false },
  );
}
