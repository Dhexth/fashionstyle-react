/**
 * =====================================================
 * Archivo: api.ts
 * =====================================================
 * Capa de comunicación con el backend / API REST.
 * - Configura la URL base.
 * - Maneja errores y encabezados.
 * - Simplifica peticiones GET, POST, PUT, DELETE.
 * =====================================================
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.tienda-demo.cl";

/**
 * Tipado genérico de respuesta API
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
}

/**
 * Función base para llamadas HTTP
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const status = res.status;
    const text = await res.text();

    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    if (!res.ok) {
      throw new Error(data?.message || `Error ${status}`);
    }

    return { success: true, data, status };
  } catch (error: any) {
    console.error("Error API:", error);
    return { success: false, message: error.message || "Error de red" };
  }
}

/**
 * Atajos para métodos comunes
 */
export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: any) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body: any) =>
    request<T>(url, { method: "PUT", body: JSON.stringify(body) }),
  del: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};

/**
 * Ejemplo de uso:
 *
 * import { api } from "../services/api";
 * const res = await api.get<Product[]>("/productos");
 * if (res.success && res.data) setProducts(res.data);
 */
