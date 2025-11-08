import React, { useEffect, useState } from "react";
import ProductGrid from "../components/product/ProductGrid";
import { fetchProducts } from "../services/productService";
import { Product } from "../types/product";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { fetchProducts().then(setProducts); }, []);
  return (
    <div>
      <h2>Productos</h2>
      <ProductGrid products={products} />
    </div>
  );
}
