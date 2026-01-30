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
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs';
import { selectLoginUser } from '../store/auth.selector';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthEffect {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private router = inject(Router);
  private authService = inject(AuthService);

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
            // console.log('AuthEffect - login successful:', response);
            return loginSuccess({ token: response.accessToken, username: response.username });
          }),
          catchError((error) => {
            // console.error('AuthEffect - login failed:', error);
            return [loginFailure({ error })];
          }),
        );
      }),
    ),
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      map(({ token, username }) => {
        console.log('AuthEffect - Storing token and redirecting:', token);
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        return loginRedirect();
      }),
    ),
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(register),
      mergeMap(({newUser}) => {
        return this.authService.register(newUser).pipe(
          map((response) => {
            console.log('AuthEffect - register successful:', response);
            return registerSuccess({ token: response.accessToken, username: response.username });
          }), 
          catchError((error) => {
            console.error('AuthEffect - register failed:', error);
            return [registerFailure({ error })];
          }),
        );
      }),
    ),
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(registerSuccess),
        map(({ token, username }) => {
          this.store.dispatch(loginSuccess({ token, username }));
        }),
      ),
    { dispatch: false },
  );

  navigateToHome$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginRedirect),
        tap(() => {
          console.log('AuthEffect - Navigating to /home');
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
          console.log('AuthEffect - Logging out and navigating to /login');
          localStorage.removeItem('token');
          this.store.dispatch(logoutSuccess());
          this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false },
  );
}
