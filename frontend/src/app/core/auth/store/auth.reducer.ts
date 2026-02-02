import { createReducer, on } from '@ngrx/store';
import * as authActions from './auth.action';
import { initialAuthState } from '../models/auth.state';

export const authReducer = createReducer(
  initialAuthState,
  on(authActions.login, (state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  }),
  on(authActions.loginSuccess, (state, { token, username }) => {
    return {
      ...state,
      token,
      isLoggedIn: true,
      username,
      loginUser: { username: '', password: '' },
      isLoading: false,
      error: null,
    };
  }),
  on(authActions.loginFailure, (state, { error }) => {
    return {
      ...state,
      isLoading: false,
      error,
    };
  }),
  on(authActions.updateLoginUser, (state, { user }) => {
    return {
      ...state,
      loginUser: user,
    };
  }),
  on(authActions.logout, (state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  }),
  on(authActions.logoutSuccess, (state) => {
    return {
      ...initialAuthState,
    };
  }),
  on(authActions.logoutFailure, (state, { error }) => {
    return {
      ...state,
      isLoading: false,
      error,
    };
  }),
  on(authActions.register, (state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  }),
  on(authActions.registerSuccess, (state) => {
    return {
      ...state,
      isLoading: false,
      error: null,
    };
  }),
  on(authActions.registerFailure, (state, { error }) => {
    return {
      ...state,
      isLoading: false,
      error,
    };
  }),
);
