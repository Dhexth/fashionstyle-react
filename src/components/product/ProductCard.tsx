import React from "react";
import { Product } from "../../types/product";
import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "../../contexts/CartContext";
import { Link } from "react-router-dom";

export default function ProductCard({ product }: { product: Product }) {
  const { dispatch } = useCart();
  return (
    <div className="card h-100">
      <img src={product.image} alt={product.name} className="card-img-top product-image" />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-primary fw-bold">{formatPrice(product.price)}</p>
        <div className="mt-auto d-flex gap-2">
          <button className="btn btn-primary" onClick={() => dispatch({ type: "ADD", payload: { ...product, quantity: 1 } })}>Agregar</button>
          <Link className="btn btn-outline-secondary" to={`/productos/${product.id}`}>Ver</Link>
        </div>
      </div>
    </div>
  );
}
