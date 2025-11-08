export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "cliente";
}

export interface UserWithPassword extends User {
  password: string; // Solo para almacenamiento interno
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}