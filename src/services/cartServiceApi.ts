const API_URL = "http://localhost:8082/api/cart";

export const cartApi = {
  /**
   * Obtiene todos los registros de la base de datos (puerto 8082).
   * Mapea los campos para que coincidan con tu Entidad Java.
   */
  fetchItems: async (): Promise<any[]> => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) return [];
      const data = await res.json();
      
      // 🔴 CAMBIO CRÍTICO: "cartItemList" en lugar de "cartItems"
      // Tu controlador Spring Boot devuelve: { "_embedded": { "cartItemList": [...] } }
      const items = data?._embedded?.cartItemList || (Array.isArray(data) ? data : []);
      
      console.log("📊 Items obtenidos del backend:", items.length);
      
      // Retornamos los datos asegurando que los nombres coincidan con tu Entidad
      return items.map((i: any) => ({ 
        ...i, 
        id: String(i.id),           // ID de la fila en MySQL (clave primaria)
        productId: i.productId,      // private String productId
        name: i.name,                // private String name
        price: Number(i.price),      // private Double price
        quantity: Number(i.quantity),// private Integer quantity
        image: i.image               // private String image
      }));
    } catch (e) {
      console.error("Error en fetchItems:", e);
      return [];
    }
  },

  /**
   * Agrega un producto evitando duplicados en la DB.
   * Si ya existe el productId, suma 1 a la cantidad (PUT).
   * Si no existe, crea un nuevo registro (POST).
   */
  addItem: async (product: any, currentItems: any[]): Promise<any> => {
    // Buscamos si el producto ya está en el carrito local por su productId
    const existingItem = currentItems.find(
      (item) => String(item.productId) === String(product.id)
    );

    if (existingItem) {
      // SI YA EXISTE: Actualizamos cantidad en MySQL (PUT)
      const newQty = existingItem.quantity + 1;
      const res = await fetch(`${API_URL}/${existingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
      const updated = await res.json();
      return { ...updated, id: String(updated.id), isUpdate: true };
    } else {
      // SI NO EXISTE: Creamos nuevo registro (POST)
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: String(product.id),
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        }),
      });
      const saved = await res.json();
      return { ...saved, id: String(saved.id), isUpdate: false };
    }
  },

  /**
   * Actualiza la cantidad de un registro específico en MySQL.
   */
  updateQty: async (dbId: string, qty: number): Promise<any> => {
    const res = await fetch(`${API_URL}/${dbId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty }),
    });
    return await res.json();
  },

  /**
   * Elimina un registro de la base de datos por su ID.
   */
  removeItem: async (dbId: string): Promise<void> => {
    await fetch(`${API_URL}/${dbId}`, { method: "DELETE" });
  },

  /**
   * Limpia todo el carrito (requiere endpoint personalizado en el backend).
   */
  clearCart: async (): Promise<void> => {
    await fetch(`${API_URL}/clear`, { method: "DELETE" });
  }
};