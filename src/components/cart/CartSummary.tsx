import React from "react";
import { useCart } from "../../contexts/CartContext";
import { formatPrice } from "../../utils/formatPrice";

export default function CartSummary() {
  const { state, dispatch } = useCart();

  const shippingCost = state.total > 0 ? 4000 : 0;
  const totalWithShipping = state.total + shippingCost;

  const handleCheckout = () => {
    // Aquí integrarías Stripe, Webpay, etc.
    alert("Redirigiendo al proceso de pago...");
    dispatch({ type: "CLEAR" });
  };

  const handleClear = () => {
    if (confirm("¿Estás seguro de que quieres vaciar todo el carrito?")) {
      dispatch({ type: "CLEAR" });
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h5 className="mb-3 border-bottom pb-2">
        <i className="bi bi-receipt me-2"></i>
        Resumen del pedido
      </h5>
      
      {/* Detalles del pedido */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span>Productos ({state.items.length})</span>
          <span>{formatPrice(state.total)}</span>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span>
            Costo de envío
            <small className="text-muted d-block">Entrega estándar</small>
          </span>
          <span>{state.total > 0 ? formatPrice(shippingCost) : formatPrice(0)}</span>
        </div>
        
        <hr />
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <strong className="h6">Total a pagar</strong>
          <strong className="text-primary h5">
            {formatPrice(totalWithShipping)}
          </strong>
        </div>
      </div>

      {/* Información adicional */}
      {state.total > 0 && (
        <div className="alert alert-info small mb-3">
          <i className="bi bi-info-circle me-2"></i>
          El envío tarda de 3 a 5 días hábiles. Impuestos incluidos.
        </div>
      )}

      {/* Botones de acción */}
      <div className="d-grid gap-2">
        <button
          className="btn btn-success btn-lg"
          disabled={state.items.length === 0}
          onClick={handleCheckout}
        >
          <i className="bi bi-shield-lock me-2"></i>
          Finalizar compra
        </button>

        <button
          className="btn btn-outline-danger"
          disabled={state.items.length === 0}
          onClick={handleClear}
        >
          <i className="bi bi-trash me-2"></i>
          Vaciar carrito completo
        </button>
      </div>

      {/* Garantías */}
      <div className="mt-3 pt-3 border-top">
        <div className="row text-center small text-muted">
          <div className="col-4">
            <i className="bi bi-truck d-block mb-1"></i>
            <span>Envío gratis</span>
          </div>
          <div className="col-4">
            <i className="bi bi-shield-check d-block mb-1"></i>
            <span>Pago seguro</span>
          </div>
          <div className="col-4">
            <i className="bi bi-arrow-left-right d-block mb-1"></i>
            <span>Devoluciones</span>
          </div>
        </div>
      </div>
    </div>
  );
}