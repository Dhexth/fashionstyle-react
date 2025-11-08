import { User, UserWithPassword, LoginData, RegisterData, AuthResponse } from "../types/user";

/**
 * =====================================================
 * Servicio de autenticación y gestión de usuario
 * =====================================================
 *  - Ahora guarda múltiples usuarios en localStorage
 *  - Verifica credenciales contra usuarios registrados
 * =====================================================
 */

// Claves de almacenamiento
const USER_KEY = "auth_user";
const TOKEN_KEY = "auth_token";
const USERS_KEY = "registered_users";

/**
 * Obtiene la lista de usuarios registrados (con password)
 */
function getRegisteredUsers(): UserWithPassword[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as UserWithPassword[];
  } catch {
    return [];
  }
}

/**
 * Guarda un nuevo usuario en la lista de registrados
 */
function saveRegisteredUser(user: User, password: string) {
  const users = getRegisteredUsers();
  
  // Verificar si el usuario ya existe
  if (users.some(u => u.email === user.email)) {
    throw new Error("El usuario ya existe");
  }
  
  // Crear usuario con password para almacenamiento
  const userWithPassword: UserWithPassword = {
    ...user,
    password: password // ⚠️ Solo para simulación - en producción usar hash
  };
  
  users.push(userWithPassword);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Verifica credenciales contra usuarios registrados
 */
function verifyCredentials(email: string, password: string): User | null {
  const users = getRegisteredUsers();
  const userWithPassword = users.find(u => u.email === email && u.password === password);
  
  if (userWithPassword) {
    // Remover la contraseña del objeto que devolvemos
    const { password: _, ...user } = userWithPassword;
    return user;
  }
  return null;
}

/**
 * Simula la autenticación (login).
 * Ahora verifica contra usuarios registrados
 */
export async function login(data: LoginData): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Verificar contra usuarios registrados
  const user = verifyCredentials(data.email, data.password);
  
  if (user) {
    const token = "auth-token-" + new Date().getTime();
    saveSession(user, token);
    return { success: true, user, token };
  }

  // Si las credenciales no son válidas:
  throw new Error("Correo o contraseña incorrectos");
}

/**
 * Simula el registro de usuario.
 * Ahora guarda el usuario para futuros logins
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Verificar si el usuario ya existe
  const existingUsers = getRegisteredUsers();
  if (existingUsers.some(u => u.email === data.email)) {
    throw new Error("El usuario ya existe");
  }

  // Crear nuevo usuario
  const user: User = {
    id: Math.random().toString(36).substring(2, 9),
    name: data.name,
    email: data.email,
    role: "cliente",
  };

  // Guardar en la lista de usuarios registrados
  saveRegisteredUser(user, data.password);

  const token = "auth-token-" + new Date().getTime();
  saveSession(user, token);

  return { success: true, user, token };
}

/**
 * Guarda la sesión actual en localStorage
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
 * Simula verificación de token en backend
 */
export async function verifyToken(token: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return token.startsWith("auth-token-");
}

/**
 * Función para inicializar usuario demo
 */
function initializeDemoUser() {
  const users = getRegisteredUsers();
  const demoUserExists = users.some(u => u.email === "demo@tienda.cl");
  
  if (!demoUserExists) {
    const demoUser: User = {
      id: "demo-1",
      name: "Usuario Demo",
      email: "demo@tienda.cl",
      role: "cliente",
    };
    saveRegisteredUser(demoUser, "123456");
  }
}

// Inicializar usuario demo al cargar el servicio
initializeDemoUser();