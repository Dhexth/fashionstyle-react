const API_BASE_URL = "http://localhost:8080/api/v1";

export async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Haciendo petición a:', url);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('Status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error del servidor:', errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Respuesta exitosa');
    return data;
    
  } catch (error) {
    console.error('Error de conexión:', error);
    throw error; // Propaga el error para que lo maneje el llamador
  }
}

// Servicios para productos (CON FALLBACK)
export const productsAPI = {
  getAll: async () => {
    try {
      return await apiRequest<any[]>('/productos');
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      throw error; // O devolver un array vacío: return [];
    }
  },
  
  getById: async (id: string) => {
    try {
      return await apiRequest<any>(`/productos/${id}`);
    } catch (error) {
      console.error(`Error obteniendo producto ${id}:`, error);
      throw error;
    }
  },
  
  getFeatured: async () => {
    try {
      return await apiRequest<any[]>('/productos/destacados');
    } catch (error) {
      console.error('Error obteniendo destacados:', error);
      return []; // Fallback a array vacío
    }
  },
};