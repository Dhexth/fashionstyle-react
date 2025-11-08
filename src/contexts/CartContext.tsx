import React, { createContext, useReducer, useContext, ReactNode, useEffect } from "react";
import { CartItem } from "../types/cart";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  emptyCart,
  getCartTotal,
  initCart,
} from "../services/cartService";

type State = { items: CartItem[]; total: number };
type Action =
  | { type: "ADD"; payload: CartItem }
  | { type: "REMOVE"; payload: string }
  | { type: "UPDATE_QTY"; payload: { id: string; qty: number } }
  | { type: "CLEAR" };

// ...existing code...
export const CartContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);
// ...existing code...

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const updated = addToCart(state.items, action.payload, action.payload.quantity);
      return { items: updated, total: getCartTotal(updated) };
    }
    case "REMOVE": {
      const updated = removeFromCart(state.items, action.payload);
      return { items: updated, total: getCartTotal(updated) };
    }
    case "UPDATE_QTY": {
      const updated = updateQuantity(state.items, action.payload.id, action.payload.qty);
      return { items: updated, total: getCartTotal(updated) };
    }
    case "CLEAR":
      emptyCart();
      return { items: [], total: 0 };
    default:
      return state;
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initCart());

  // Persistencia en localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de un CartProvider");
  return ctx;
};