import { User, LoginData, RegisterData, AuthResponse } from "../types/user";

// Claves de almacenamiento
const USER_KEY = "auth_user";
const TOKEN_KEY = "auth_token";
const API_BASE_URL = "http://localhost:8080/api/v1";

/**
 * =====================================================
 * Servicio de autenticación CONECTADO AL BACKEND SPRING BOOT
 * =====================================================
 *  - Ahora usa tu backend real en lugar de localStorage
 *  - Las contraseñas se validan en el servidor
 * =====================================================
 */

/**
 * Función para hacer peticiones al backend
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('🔗 Haciendo petición a:', url);
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || `Error ${response.status}`);
  }

  return responseData;
}

/**
 * Login REAL con el backend Spring Boot
 */
export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    console.log('📨 Intentando login con backend:', data.email);
    
    const response = await apiRequest<{ 
      success: boolean; 
      user: User; 
      token: string;
      message?: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password
      }),
    });

    if (response.success) {
      console.log('Login exitoso con backend:', response.user);
      saveSession(response.user, response.token);
      return { success: true, user: response.user, token: response.token };
    } else {
      throw new Error(response.message || "Error en el servidor");
    }
  } catch (error: any) {
    console.error('Error en login con backend:', error);
    throw new Error(error.message || "No se pudo conectar con el servidor");
  }
}

/**
 * Registro REAL con el backend Spring Boot
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    console.log('📨 Intentando registro con backend:', data.email);
    
    const response = await apiRequest<{ 
      success: boolean; 
      user: User; 
      token: string;
      message?: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password
      }),
    });

    if (response.success) {
      console.log('✅ Registro exitoso con backend:', response.user);
      saveSession(response.user, response.token);
      return { success: true, user: response.user, token: response.token };
    } else {
      throw new Error(response.message || "Error en el servidor");
    }
  } catch (error: any) {
    console.error('Error en registro con backend:', error);
    throw new Error(error.message || "No se pudo conectar con el servidor");
  }
}

/**
 * Guarda la sesión en localStorage (igual que antes)
 */
export function saveSession(user: User, token: string) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Elimina la sesión actual
 */
export function logout() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Obtiene el usuario actual guardado
 */
export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

/**
 * Obtiene el token actual
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Valida si hay sesión activa
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  const user = getCurrentUser();
  return !!token && !!user;
}

/**
 * Verificación de token (puede llamar al backend si quieres)
 */
export async function verifyToken(token: string): Promise<boolean> {
  // Por ahora sigue siendo local, pero puedes implementar verificación con backend
  await new Promise((resolve) => setTimeout(resolve, 300));
  return token.startsWith("auth-token-");
}

/**
 * Función auxiliar para obtener el ID del usuario como número (para el backend)
 */
export function getCurrentUserId(): number | null {
  const user = getCurrentUser();
  if (user && user.id) {
    // Convierte el ID string a número para el backend Spring Boot
    return parseInt(user.id);
  }
  return null;
}