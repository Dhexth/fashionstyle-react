import React from "react";
import { Product } from "../../types/product";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="row g-3">
      {products.map((p) => (
        <div key={p.id} className="col-sm-6 col-md-4">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}