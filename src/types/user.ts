export interface User {
  id: string;
  run: string;
  name: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'CLIENTE' | string;
  isAuthenticated?: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  run: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  timestamp?: string;
}