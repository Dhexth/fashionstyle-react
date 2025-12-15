import { Product } from "../types/product";

const API_URL = "http://localhost:8081/api/products";

/**
 * ADAPTADOR DE DATOS
 * Mantiene los campos originales para el Admin (...p)
 * y genera la propiedad 'image' con la URL completa para el Frontend.
 */
const mapProduct = (p: any): Product => ({
  ...p,
  // Aseguramos que el ID sea string para evitar errores en React
  id: String(p.id),
  // Construye la URL completa de la imagen para la Home/Tienda
  image: p.imageUrl 
    ? `http://localhost:8081${p.imageUrl}` 
    : "https://via.placeholder.com/300"
});

/**
 * Obtener todos los productos
 * Soporta formatos: Spring Data REST (_embedded), Listas simples [] y Paginación (content)
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Error en la red: ${response.status}`);
    
    const data = await response.json();
    
    // Lógica para extraer la lista según el formato del JSON recibido
    let rawProducts: any[] = [];
    
    if (data._embedded && data._embedded.products) {
      // Formato detectado en tu JSON (Spring Data REST)
      rawProducts = data._embedded.products;
    } else if (Array.isArray(data)) {
      // Formato lista simple
      rawProducts = data;
    } else if (data.content) {
      // Formato paginación estándar
      rawProducts = data.content;
    }

    return rawProducts.map(mapProduct);
  } catch (error) {
    console.error("Error al traer productos:", error);
    return [];
  }
}

// Alias para mantener compatibilidad con el Admin y otros componentes
export const fetchProductsFromApi = fetchProducts;

/**
 * Obtener un solo producto por su ID
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return mapProduct(data);
  } catch (error) {
    console.error("Error al traer producto por ID:", error);
    return null;
  }
}

// --- FUNCIONES PARA EL ADMIN (Crear, Editar, Eliminar) ---

export async function createProductFromApi(formData: FormData): Promise<boolean> {
  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });
  return response.ok;
}

export async function updateProductFromApi(id: string, formData: FormData): Promise<boolean> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: formData,
  });
  return response.ok;
}

export async function deleteProductFromApi(id: string | number): Promise<boolean> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return response.ok;
}