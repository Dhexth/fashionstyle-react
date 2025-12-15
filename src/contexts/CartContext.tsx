import React, { createContext, useReducer, useContext, ReactNode, useEffect } from "react";
import { CartItem } from "../types/cart";
import { cartApi } from "../services/cartServiceApi";
import { getCartTotal } from "../services/cartService";

type State = { items: CartItem[]; total: number };
type Action =
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "ADD"; payload: CartItem }
  | { type: "REMOVE"; payload: string }
  | { type: "UPDATE_QTY"; payload: { id: string; qty: number } }
  | { type: "CLEAR" };

const CartContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_CART":
      return { items: action.payload, total: getCartTotal(action.payload) };
    case "ADD": {
      const items = [...state.items, action.payload];
      return { items, total: getCartTotal(items) };
    }
    case "REMOVE": {
      const items = state.items.filter(i => i.id !== action.payload);
      return { items, total: getCartTotal(items) };
    }
    case "UPDATE_QTY": {
      const items = state.items.map(i => i.id === action.payload.id ? { ...i, quantity: action.payload.qty } : i);
      return { items, total: getCartTotal(items) };
    }
    case "CLEAR":
      return { items: [], total: 0 };
    default:
      return state;
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { items: [], total: 0 });

  // 🟢 SINCRONIZACIÓN INICIAL CON LARAGON
  useEffect(() => {
    cartApi.fetchItems().then(items => {
      dispatch({ type: "SET_CART", payload: items });
    });
  }, []);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de un CartProvider");
  return ctx;
};