/**
 * =====================================================
 *  constants.ts
 * =====================================================
 * Archivo central para definir constantes globales
 * de la tienda FashionStyle.
 * =====================================================
 */

export const APP_NAME = "FashionStyle";
export const APP_VERSION = "1.0.0";
export const APP_AUTHOR = "Ariel Ortiz Díaz";

// Configuración general
export const CURRENCY_SYMBOL = "$";
export const TAX_RATE = 0.19; // IVA 19%

// Rutas base
export const API_BASE_URL = "https://api.fashionstyle.cl"; // (puedes cambiarlo por tu backend real)
export const IMAGES_BASE_URL = "/img/";

// Límite de productos visibles por página
export const PRODUCTS_PER_PAGE = 12;

// Mensajes comunes
export const MESSAGES = {
  ADD_SUCCESS: "Producto agregado al carrito correctamente.",
  REMOVE_SUCCESS: "Producto eliminado del carrito.",
  CLEAR_CART: "El carrito ha sido vaciado.",
  LOGIN_SUCCESS: "Inicio de sesión exitoso.",
  LOGOUT_SUCCESS: "Has cerrado sesión correctamente.",
  ERROR_GENERIC: "Ha ocurrido un error inesperado.",
};
