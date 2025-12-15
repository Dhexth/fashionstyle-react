import React, { useEffect, useState } from "react";
import ProductGrid from "../components/product/ProductGrid";
// 🟢 IMPORTANTE: Importar desde Api
import { fetchProducts } from "../services/productServiceApi"; 
import { Product } from "../types/product";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="container mt-5 text-center">Cargando productos reales...</div>;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4">Productos</h2>
      <ProductGrid products={products} />
    </div>
  );
}