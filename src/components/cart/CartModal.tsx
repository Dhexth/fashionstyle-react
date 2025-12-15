import React from "react";
import { useCart } from "../../contexts/CartContext";
import { formatPrice } from "../../utils/formatPrice";
import { cartApi } from "../../services/cartServiceApi"; // Importamos la API

export default function CartModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const { state, dispatch } = useCart();

  // 🟢 ELIMINAR: Borra en DB y luego en React
  const handleRemove = async (id: string) => {
    try {
      await cartApi.removeItem(id);
      dispatch({ type: "REMOVE", payload: id });
    } catch (e) {
      console.error("Error al eliminar de la DB", e);
    }
  };

  // 🟢 ACTUALIZAR CANTIDAD (+ y -): Sincroniza con DB
  const updateQty = async (id: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    
    if (newQty <= 0) {
      handleRemove(id);
      return;
    }

    try {
      // 1. Intentamos actualizar en MySQL
      await cartApi.updateQty(id, newQty);
      // 2. Si tiene éxito, actualizamos la pantalla
      dispatch({ type: "UPDATE_QTY", payload: { id, qty: newQty } });
    } catch (e) {
      alert("No se pudo actualizar la cantidad en el servidor");
    }
  };

  // 🟢 VACIAR CARRITO: Limpia MySQL por completo
  const handleClearAll = async () => {
    if (window.confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      try {
        await cartApi.clearCart(); // Llama al endpoint /clear de tu Java
        dispatch({ type: "CLEAR" });
      } catch (e) {
        alert("Error al vaciar la base de datos");
      }
    }
  };

  const shippingCost = state.total > 0 ? 4000 : 0;
  const totalWithShipping = state.total + shippingCost;

  if (state.items.length === 0) {
    return (
      <div className="card p-4">
        <div className="text-center py-4">
          <i className="bi bi-cart-x display-4 text-muted"></i>
          <h5 className="mt-3">Tu carrito está vacío</h5>
          <p className="text-muted">Agrega algunos productos para continuar</p>
          <button className="btn btn-primary mt-2" onClick={onClose}>
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-0 shadow-lg">
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="mb-0">
          <i className="bi bi-cart3 me-2"></i>
          Tu carrito ({state.items.length})
        </h5>
        <button className="btn btn-outline-secondary btn-sm" onClick={onClose}>
          Volver
        </button>
      </div>

      <div style={{ maxHeight: 400, overflowY: "auto" }} className="p-3">
        {state.items.map((item) => (
          <div key={item.id} className="d-flex gap-3 align-items-center mb-3 border-bottom pb-3">
            <img 
              src={item.image} 
              alt={item.name} 
              style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 8 }} 
            />
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start mb-1">
                <strong className="small">{item.name}</strong>
                <strong className="text-primary">
                  {formatPrice(item.price * item.quantity)}
                </strong>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center border rounded">
                    <button 
                      className="btn btn-sm btn-outline-secondary border-0 px-2"
                      onClick={() => updateQty(item.id, item.quantity, -1)}
                    >
                      −
                    </button>
                    <span className="px-2" style={{ minWidth: "30px", textAlign: "center" }}>
                      {item.quantity}
                    </span>
                    <button 
                      className="btn btn-sm btn-outline-secondary border-0 px-2"
                      onClick={() => updateQty(item.id, item.quantity, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleRemove(item.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-top">
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal:</span>
            <span>{formatPrice(state.total)}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Envío:</span>
            <span>{formatPrice(shippingCost)}</span>
          </div>
          <hr />
          <div className="d-flex justify-content-between mb-3">
            <strong>Total:</strong>
            <strong className="text-primary h5">{formatPrice(totalWithShipping)}</strong>
          </div>
        </div>

        <div className="d-grid gap-2">
          <button className="btn btn-success" onClick={() => alert("Checkout...")}>
            <i className="bi bi-credit-card me-2"></i>
            Proceder al pago
          </button>
          
          <button className="btn btn-outline-danger" onClick={handleClearAll}>
            <i className="bi bi-trash me-2"></i>
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  );
}