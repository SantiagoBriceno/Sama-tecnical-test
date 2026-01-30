import { createSelector } from '@ngrx/store';
import { AuthState } from '../models/auth.state';
import { AppState } from '../../../app.state';

export const selectAuthState = (state: AppState) => state.auth;

export const selectLoginUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.loginUser,
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading,
);

export const selectToken = createSelector(selectAuthState, (state: AuthState) => state.token);

export const selectError = createSelector(selectAuthState, (state: AuthState) => state.error);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoggedIn,
);

export const selectUsername = createSelector(selectAuthState, (state: AuthState) => state.username);
