import React from "react";
import { CartItem as CartItemType } from "../../types/cart";
import { useCart } from "../../contexts/CartContext";
import { cartApi } from "../../services/cartServiceApi";
import { formatPrice } from "../../utils/formatPrice";

export default function CartItem({ item }: { item: CartItemType }) {
  const { dispatch } = useCart();

  const handleQtyChange = async (delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) return;
    try {
      await cartApi.updateQty(item.id, newQty);
      dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: newQty } });
    } catch (e) { console.error(e); }
  };

  const handleDelete = async () => {
    try {
      await cartApi.removeItem(item.id);
      dispatch({ type: "REMOVE", payload: item.id });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="d-flex align-items-center border-bottom border-secondary py-3 bg-transparent text-reset">
      <img src={item.image} alt={item.name} className="rounded shadow-sm" style={{ width: 60, height: 60, objectFit: "cover" }} />
      <div className="ms-3 flex-grow-1">
        <h6 className="mb-1 fw-bold small">{item.name}</h6>
        <div className="d-flex align-items-center gap-2">
          <div className="btn-group border border-secondary rounded">
            <button className="btn btn-sm text-reset px-2" onClick={() => handleQtyChange(-1)}>-</button>
            <span className="px-2 small">{item.quantity}</span>
            <button className="btn btn-sm text-reset px-2" onClick={() => handleQtyChange(1)}>+</button>
          </div>
          <span className="text-primary small fw-bold">{formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>
      <button className="btn btn-link text-danger p-2" onClick={handleDelete}>
        <i className="bi bi-trash3-fill fs-5"></i>
      </button>
    </div>
  );
}