export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  createdAt?: string; 
  picture?: string | null;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface GoogleLoginResponse {
  accessToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  login: (token: string, user: User) => void;
}

export type AuthStore = AuthState & AuthActions;

export interface CreateUserDto {
  username: string;
  email: string;
  role?: Role;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  role?: Role;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
