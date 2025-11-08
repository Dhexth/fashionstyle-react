import { CartItem } from "../types/cart";
import { Product } from "../types/product";

/**
 * =====================================================
 *  Servicio de gestión de carrito (cartService)
 * =====================================================
 *  Este módulo centraliza toda la lógica del carrito:
 *   - Persistencia en localStorage
 *   - Agregar, eliminar, actualizar cantidad
 *   - Calcular total
 *   - Simular un checkout
 * =====================================================
 */

/**
 * Obtiene el carrito almacenado en localStorage
 */
export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch (error) {
    console.error("Error al leer el carrito:", error);
    return [];
  }
}

/**
 * Guarda el carrito completo en localStorage
 */
export function saveCart(items: CartItem[]): void {
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch (error) {
    console.error("Error al guardar el carrito:", error);
  }
}

/**
 * Elimina el carrito completo del almacenamiento
 */
export function clearCart(): void {
  try {
    localStorage.removeItem("cart");
  } catch (error) {
    console.error("Error al limpiar el carrito:", error);
  }
}

/**
 * Calcula el total del carrito
 */
export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

/**
 * Busca si un producto ya existe en el carrito
 */
export function findItem(items: CartItem[], productId: string): CartItem | undefined {
  return items.find((i) => i.id === productId);
}

/**
 * Agrega un producto al carrito.
 * Si ya existe, incrementa su cantidad.
 */
export function addToCart(items: CartItem[], product: Product, qty: number = 1): CartItem[] {
  const existing = findItem(items, product.id);
  let updated: CartItem[];

  if (existing) {
    updated = items.map((i) =>
      i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
    );
  } else {
    updated = [...items, { ...product, quantity: qty }];
  }

  saveCart(updated);
  return updated;
}

/**
 * Elimina un producto del carrito por ID
 */
export function removeFromCart(items: CartItem[], id: string): CartItem[] {
  const updated = items.filter((i) => i.id !== id);
  saveCart(updated);
  return updated;
}

/**
 * Actualiza la cantidad de un producto
 */
export function updateQuantity(items: CartItem[], id: string, qty: number): CartItem[] {
  let updated: CartItem[];
  if (qty <= 0) {
    updated = removeFromCart(items, id);
  } else {
    updated = items.map((i) => (i.id === id ? { ...i, quantity: qty } : i));
  }
  saveCart(updated);
  return updated;
}

/**
 * Vacía completamente el carrito
 */
export function emptyCart(): CartItem[] {
  clearCart();
  return [];
}

/**
 * Simula un proceso de checkout.
 * Puedes reemplazarlo por una llamada real a tu backend (Stripe, Webpay, etc.)
 */
export async function checkout(items: CartItem[]) {
  if (items.length === 0) {
    throw new Error("El carrito está vacío, no se puede procesar el pago.");
  }

  // Simula un pequeño retraso de red
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Limpiar carrito tras la compra
  clearCart();

  return {
    success: true,
    message: "Compra realizada con éxito.",
    totalPagado: getCartTotal(items),
    fecha: new Date().toISOString(),
  };
}

/**
 * Inicializa el carrito (leer del almacenamiento)
 */
export function initCart(): { items: CartItem[]; total: number } {
  const items = getCart();
  const total = getCartTotal(items);
  return { items, total };
}

/**
 * Obtiene la cantidad total de productos (sumando cantidades)
 */
export function getTotalQuantity(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

/**
 * Limpia todo y retorna carrito vacío con total en 0
 */
export function resetCartState(): { items: CartItem[]; total: number } {
  clearCart();
  return { items: [], total: 0 };
}
