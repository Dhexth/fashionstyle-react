import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../services/productServiceApi"; 
import { Product } from "../types/product";
import { useCart } from "../contexts/CartContext";
import { formatPrice } from "../utils/formatPrice";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { dispatch } = useCart();

  useEffect(() => {
    if (id) {
      fetchProductById(id).then((data) => {
        if (data) setProduct(data);
      });
    }
  }, [id]);

  if (!product) return <div className="container mt-5 text-center">Cargando producto real...</div>;

  const isOutOfStock = (product.stock ?? 0) <= 0;
  const isLowStock = (product.stock ?? 0) > 0 && (product.stock ?? 0) <= 5;

  return (
    <div className="container mt-5">
      <div className="row g-5 align-items-center">
        {/* Imagen del Producto */}
        <div className="col-md-6">
          <img 
            src={product.image} 
            alt={product.name} 
            className="img-fluid rounded shadow-lg" 
            style={{ width: "100%", maxHeight: "550px", objectFit: "cover" }}
          />
        </div>

        {/* Información del Producto */}
        <div className="col-md-6">
          <h2 className="fw-bold display-6 mb-3">{product.name}</h2>
          
          <div className="mb-4">
            <span className="text-primary fs-2 fw-bold me-3">
              {formatPrice(product.price)}
            </span>
            {isOutOfStock ? (
              <span className="badge bg-danger p-2">Agotado</span>
            ) : (
              <span className={`badge p-2 ${isLowStock ? "bg-warning text-dark" : "bg-success"}`}>
                Stock: {product.stock} unidades
              </span>
            )}
          </div>

          <hr />

          {/* 🟢 CORRECCIÓN MODO OSCURO: Quitamos 'text-muted' para que se adapte al tema */}
          <div className="product-description mb-4">
            <h5 className="fw-bold">Descripción:</h5>
            <p className="fs-5" style={{ color: 'inherit', opacity: 0.9 }}>
              {product.description}
            </p>
          </div>
          
          {/* 🟢 CORRECCIÓN BOTÓN: Tamaño ajustado (sin w-100) */}
          <div className="d-flex gap-3 align-items-center">
            <button 
              className="btn btn-primary btn-lg px-5 shadow-sm"
              disabled={isOutOfStock}
              onClick={() => dispatch({ type: "ADD", payload: { ...product, quantity: 1 } })}
            >
              <i className="bi bi-cart-plus me-2"></i>
              {isOutOfStock ? "Sin Stock" : "Agregar al carrito"}
            </button>
          </div>

          {product.category && (
            <div className="mt-4 pt-3 border-top">
              <span className="text-secondary small">Categoría: {product.category}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}