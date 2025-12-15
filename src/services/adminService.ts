import axios from "axios";

const API_URL = "http://localhost:8080/api";

// ==================== CONFIGURACIÓN DE AXIOS ====================
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token AUTOMÁTICAMENTE
api.interceptors.request.use(
  (config) => {
    // Buscar token en TODOS los lugares posibles
    const token = 
      localStorage.getItem("token") || 
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("token");
    
    console.log("🔐 Token usado:", token ? `${token.substring(0, 30)}...` : "NO HAY TOKEN");
    
    if (token && config.headers) {
      // Verificar que el token sea un JWT válido (empieza con "eyJ")
      if (!token.startsWith("eyJ")) {
        console.error("❌ Token NO es JWT válido. Empieza con:", token.substring(0, 20));
        localStorage.removeItem("token");
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("token");
        window.location.href = "/login";
        return config;
      }
      
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token agregado a headers");
    } else {
      console.warn("⚠️  No se encontró token para la petición");
    }
    
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      console.log("📝 Payload:", config.data);
    }
    
    return config;
  },
  (error) => {
    console.error("❌ Error en interceptor de request:", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ ERROR DE AXIOS DETECTADO:");
    console.error("Nombre:", error.name);
    console.error("Mensaje:", error.message);
    console.error("Código:", error.code);
    
    if (error.response) {
      // El servidor respondió con un error
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
      
      // Si es error 401 (no autorizado), limpiar tokens
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("token");
        console.warn("⚠️  Token inválido o expirado. Redirigiendo a login...");
        window.location.href = "/login";
      }
      
      // Si es error 403 (prohibido)
      if (error.response.status === 403) {
        console.error("🔒 Acceso denegado. Se requiere rol ADMIN.");
      }
      
    } else if (error.request) {
      // No hubo respuesta del servidor
      console.error("🌐 No hay respuesta del servidor. Verifica:");
      console.error("   1. ¿Spring Boot está corriendo?");
      console.error("   2. ¿El puerto 8080 está disponible?");
      console.error("   3. ¿Hay error de CORS?");
      console.error("Request:", error.request);
    } else {
      // Error al configurar la petición
      console.error("⚙️ Error de configuración:", error.message);
    }
    
    return Promise.reject(error);
  }
);

// ==================== FUNCIONES PARA USUARIOS ====================

/**
 * Obtener todos los usuarios (requiere ADMIN)
 */
export async function getUsers(): Promise<any[]> {
  try {
    console.log("🔄 Obteniendo lista de usuarios...");
    const response = await api.get("/users");
    
    // Manejar diferentes formatos de respuesta
    let users: any[] = [];
    if (Array.isArray(response.data)) {
      users = response.data;
    } else if (response.data._embedded && response.data._embedded.userList) {
      users = response.data._embedded.userList;
    } else {
      users = [response.data];
    }
    
    console.log(`✅ Obtenidos ${users.length} usuarios`);
    return users;
  } catch (error: any) {
    console.error("❌ Error en getUsers:", error);
    
    let errorMessage = "Error al obtener usuarios";
    
    if (error.response?.status === 403) {
      errorMessage = "No tienes permisos de administrador";
    } else if (error.response?.status === 401) {
      errorMessage = "No estás autenticado. Inicia sesión.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Obtener usuario por ID
 */
export async function getUserById(id: string): Promise<any> {
  try {
    console.log(`🔄 Obteniendo usuario ID: ${id}`);
    const response = await api.get(`/users/${id}`);
    console.log("✅ Usuario obtenido:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Error obteniendo usuario ${id}:`, error);
    
    let errorMessage = "Usuario no encontrado";
    
    if (error.response?.status === 404) {
      errorMessage = `Usuario con ID ${id} no existe`;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Crear nuevo usuario (requiere ADMIN)
 */
export async function createUser(userData: any): Promise<any> {
  try {
    console.log("🔄 Creando nuevo usuario...");
    
    // Validar datos requeridos
    const requiredFields = ["run", "name", "lastName", "email", "password"];
    const missingFields = requiredFields.filter(field => !userData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Faltan campos: ${missingFields.join(", ")}`);
    }
    
    // Preparar datos para enviar
    const dataToSend = {
      ...userData,
      role: userData.role ? userData.role.toUpperCase() : "CLIENTE"
    };
    
    console.log("📤 Enviando datos:", dataToSend);
    
    const response = await api.post("/users", dataToSend);
    
    console.log("✅ Usuario creado exitosamente:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error en createUser:", error);
    
    let errorMessage = "Error al crear usuario";
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 403) {
        errorMessage = "No tienes permisos de administrador para crear usuarios";
      } else if (status === 409) {
        errorMessage = "El email ya está registrado";
      } else if (status === 400) {
        errorMessage = `Datos inválidos: ${data.message || "verifica los campos"}`;
      } else if (status === 401) {
        errorMessage = "No autenticado. Inicia sesión como administrador.";
      } else if (data?.message) {
        errorMessage = `Backend: ${data.message}`;
      }
    } else if (error.request) {
      errorMessage = "El servidor no responde. Verifica que esté corriendo.";
    } else {
      errorMessage = error.message || "Error desconocido";
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Actualizar usuario existente
 */
export async function updateUser(id: string, userData: any): Promise<any> {
  try {
    console.log(`🔄 Actualizando usuario ID: ${id}`);
    
    // Si se envía rol, convertir a mayúsculas
    const dataToSend = { ...userData };
    if (dataToSend.role) {
      dataToSend.role = dataToSend.role.toUpperCase();
    }
    
    const response = await api.put(`/users/${id}`, dataToSend);
    
    console.log("✅ Usuario actualizado:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Error actualizando usuario ${id}:`, error);
    
    let errorMessage = "Error al actualizar usuario";
    
    if (error.response?.status === 404) {
      errorMessage = "Usuario no encontrado";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Eliminar usuario (requiere ADMIN)
 */
export async function deleteUser(id: string): Promise<void> {
  try {
    console.log(`🔄 Eliminando usuario ID: ${id}`);
    
    await api.delete(`/users/${id}`);
    
    console.log("✅ Usuario eliminado exitosamente");
  } catch (error: any) {
    console.error(`❌ Error eliminando usuario ${id}:`, error);
    
    let errorMessage = "Error al eliminar usuario";
    
    if (error.response?.status === 404) {
      errorMessage = "Usuario no encontrado";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    throw new Error(errorMessage);
  }
}

// ==================== FUNCIONES DE COMPATIBILIDAD ====================
// (Si las necesitas para algo más)

export function getProducts() {
  const data = localStorage.getItem("admin_products");
  return data ? JSON.parse(data) : [];
}

export function saveProducts(list: any[]) {
  localStorage.setItem("admin_products", JSON.stringify(list));
}

export function addProduct(product: any) {
  const list = getProducts();
  product.id = Date.now().toString(); // ID simple
  list.push(product);
  saveProducts(list);
}

// ==================== FUNCIONES DE DEBUG ====================

/**
 * Verificar estado de conexión con backend
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${API_URL}/auth/health`, {
      timeout: 5000
    });
    console.log("🏥 Backend saludable:", response.data);
    return true;
  } catch (error) {
    console.error("💀 Backend NO RESPONDE:", error);
    return false;
  }
}

/**
 * Verificar autenticación actual
 */
export async function checkAuth(): Promise<{isAuthenticated: boolean, user?: any}> {
  const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
  
  if (!token) {
    console.log("🔐 No hay token");
    return { isAuthenticated: false };
  }
  
  try {
    const response = await api.get("/profile");
    console.log("👤 Usuario autenticado:", response.data);
    return { 
      isAuthenticated: true, 
      user: response.data 
    };
  } catch (error) {
    console.error("🔐 Error verificando autenticación:", error);
    return { isAuthenticated: false };
  }
}