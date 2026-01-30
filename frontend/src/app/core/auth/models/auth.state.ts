import { LoginUser } from '../../user/models/user.model';

export interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  username: string | null;
  loginUser: LoginUser;
  isLoading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  isLoggedIn: false,
  token: null,
  username: null,
  loginUser: { username: '', password: '' },
  isLoading: false,
  error: null,
};
