// services/authService.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api";

// ==================== CONFIGURACIÓN ====================
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor para token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== TIPOS ====================
export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  run: string;
  role: string;
}

// ==================== FUNCIONES PRINCIPALES ====================

// 1. REGISTRO (público)
export async function register(userData: {
  email: string;
  password: string;
  name: string;
  lastName: string;
  run: string;
  role?: string;
}): Promise<{ user: User; token: string }> {
  try {
    console.log("📝 Registrando:", userData.email);
    
    const response = await api.post("/auth/register", userData);
    
    // Guardar token
    const token = response.data.token;
    localStorage.setItem("token", token);
    
    // Crear usuario (backend devuelve datos directamente)
    const user: User = {
      id: response.data.id,
      email: response.data.email,
      name: response.data.name,
      lastName: response.data.lastName,
      run: response.data.run,
      role: response.data.role || "CLIENTE"
    };
    
    localStorage.setItem("user", JSON.stringify(user));
    
    return { user, token };
    
  } catch (error: any) {
    const message = error.response?.data?.message || "Error al registrar";
    console.error("❌ Registro error:", message);
    throw new Error(message);
  }
}

// 2. LOGIN (público)
export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  try {
    console.log("🔐 Login:", email);
    
    const response = await api.post("/auth/login", { email, password });
    
    // Guardar token
    const token = response.data.token;
    localStorage.setItem("token", token);
    
    // Crear usuario
    const user: User = {
      id: response.data.id,
      email: response.data.email,
      name: response.data.name,
      lastName: response.data.lastName,
      run: response.data.run,
      role: response.data.role
    };
    
    localStorage.setItem("user", JSON.stringify(user));
    
    return { user, token };
    
  } catch (error: any) {
    const message = error.response?.data?.message || "Credenciales incorrectas";
    console.error("❌ Login error:", message);
    throw new Error(message);
  }
}

// 3. LOGOUT
export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  console.log("👋 Sesión cerrada");
}

// 4. OBTENER USUARIO ACTUAL
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

// 5. VERIFICAR AUTH
export function isAuthenticated(): boolean {
  return localStorage.getItem("token") !== null;
}

// 6. VERIFICAR ROL
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === "ADMIN";
}

// ==================== FUNCIONES EXTRAS (opcionales) ====================

// Health check
export async function checkBackend(): Promise<boolean> {
  try {
    await api.get("/auth/health");
    return true;
  } catch {
    return false;
  }
}

// Actualizar perfil (si tienes este endpoint)
export async function updateProfile(userData: Partial<User>): Promise<User> {
  const user = getCurrentUser();
  if (!user) throw new Error("No autenticado");
  
  try {
    const response = await api.put(`/users/${user.id}`, userData);
    const updatedUser = response.data;
    
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
    
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al actualizar");
  }
}