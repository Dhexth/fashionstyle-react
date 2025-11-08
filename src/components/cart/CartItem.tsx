import React from "react";
import { CartItem as CartItemType } from "../../types/cart";
import { useCart } from "../../contexts/CartContext";
import { formatPrice } from "../../utils/formatPrice";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const { dispatch } = useCart();

  const handleRemove = () => {
    dispatch({ type: "REMOVE", payload: item.id });
  };

  const handleQtyChange = (delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      handleRemove();
      return;
    }
    dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: newQty } });
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="d-flex align-items-center border-bottom py-3 gap-3">
      <img
        src={item.image}
        alt={item.name}
        className="rounded shadow-sm"
        style={{ width: 80, height: 80, objectFit: "cover" }}
      />

      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <strong className="h6 mb-1">{item.name}</strong>
            <div className="text-muted small">
              Precio unitario: {formatPrice(item.price)}
            </div>
          </div>
          <strong className="text-primary h5">{formatPrice(subtotal)}</strong>
        </div>
        
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">Cantidad:</span>
            <div className="d-flex align-items-center border rounded">
              <button
                className="btn btn-sm btn-outline-secondary border-0"
                onClick={() => handleQtyChange(-1)}
                aria-label="Reducir cantidad"
              >
                −
              </button>
              <span className="px-3" style={{ minWidth: "40px", textAlign: "center" }}>
                {item.quantity}
              </span>
              <button
                className="btn btn-sm btn-outline-secondary border-0"
                onClick={() => handleQtyChange(1)}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          </div>
          
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={handleRemove}
            aria-label="Eliminar producto"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}