import React from "react";
import { Link } from "react-router-dom"; // Importante para el botón Ver [cite: 70]
import { useCart } from "../../contexts/CartContext";
import { cartApi } from "../../services/cartServiceApi";
import { formatPrice } from "../../utils/formatPrice"; // [cite: 69]

export default function ProductCard({ product }: { product: any }) {
  const { state, dispatch } = useCart(); // [cite: 71]

  const handleAdd = async () => {
    try {
      const result = await cartApi.addItem(product, state.items);
      
      if (result.isUpdate) {
        // Actualiza solo la cantidad visualmente [cite: 57]
        dispatch({ 
          type: "UPDATE_QTY", 
          payload: { id: result.id, qty: result.quantity } 
        });
      } else {
        // Agrega el nuevo producto al estado [cite: 58]
        dispatch({ type: "ADD", payload: result });
      }
    } catch (error) {
      console.error("Error al sincronizar carrito:", error);
    }
  };

  return (
    <div className="card h-100 shadow-sm border-secondary bg-transparent text-reset">
      <img 
        src={product.image} 
        alt={product.name} 
        className="card-img-top product-image" 
        style={{ height: "200px", objectFit: "cover" }} 
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-reset">{product.name}</h5>
        <p className="card-text text-primary fw-bold">{formatPrice(product.price)}</p>
        
        <div className="mt-auto d-flex gap-2">
          {/* Botón AGREGAR */}
          <button className="btn btn-primary flex-grow-1" onClick={handleAdd}>
            <i className="bi bi-cart-plus me-1"></i>
            Agregar
          </button>
          
          {/* Botón VER (Restaurado)  */}
          <Link 
            className="btn btn-outline-secondary" 
            to={`/productos/${product.id}`}
          >
            Ver
          </Link>
        </div>
      </div>
    </div>
  );
}