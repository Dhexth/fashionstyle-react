import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../services/productService";
import { Product } from "../types/product";
import { useCart } from "../contexts/CartContext";
import { formatPrice } from "../utils/formatPrice";

export default function ProductDetail(){
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { dispatch } = useCart();

  useEffect(() => {
    if (id) fetchProductById(id).then(setProduct);
  }, [id]);

  if(!product) return <p>Cargando...</p>;

  return (
    <div className="row">
      <div className="col-md-6"><img src={product.image} className="img-fluid" /></div>
      <div className="col-md-6">
        <h2>{product.name}</h2>
        <p className="text-primary fw-bold">{formatPrice(product.price)}</p>
        <p>{product.description}</p>
        <button className="btn btn-primary" onClick={() => dispatch({ type: "ADD", payload: { ...product, quantity: 1 } })}>Agregar al carrito</button>
      </div>
    </div>
  );
}
