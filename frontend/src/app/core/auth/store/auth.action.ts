import { createAction, props } from '@ngrx/store';
import { LoginUser, RegisterUser } from '../../user/models/user.model';

export const isLoggedIn = createAction('[Auth] Is Logged In');

export const notIsLoggedIn = createAction('[Auth] Not Is Logged In');

export const login = createAction('[Auth] Login');

export const loginSuccess = createAction('[Auth] Login Success', props<{ token: string, username: string }>());

export const loginFailure = createAction('[Auth] Login Failure', props<{ error: any }>());

// action auxiliar para redirección después del login exitoso
export const loginRedirect = createAction('[Auth] Login Redirect');

export const updateLoginUser = createAction(
  '[Auth] Update Login User',
  props<{ user: LoginUser }>(),
);

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction('[Auth] Logout Failure', props<{ error: any }>());

// Otra forma de manejar los datos con props, es distinto a como se hizo en login.
export const register = createAction('[Auth] Register', props<{ newUser: RegisterUser }>());

export const registerSuccess = createAction('[Auth] Register Success', props<{token: string, username: string}>());

export const registerFailure = createAction('[Auth] Register Failure', props<{ error: any }>());
