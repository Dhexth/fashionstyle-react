import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../types/product";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const STORAGE_KEY = "products";

/* ---------- DATA INICIAL ---------- */
const initialProducts: Product[] = [
  {
    id: "p-1",
    name: "Polera Básica Blanca",
    image: "/images/productos/polera-blanca.jpg",
    price: 19990,
    description: "Polera 100% algodón",
    category: "Ropa",
  },
  {
    id: "p-2",
    name: "Jeans Slim Fit",
    image: "/images/productos/jeans-slim-fit.jpg",
    price: 39990,
    description: "Jeans cómodos y resistentes",
    category: "Ropa",
  },
];

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialProducts;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  /* ---------- ACTIONS ---------- */
  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (product: Product) => {
    setProducts(prev =>
      prev.map(p => (p.id === product.id ? product : p))
    );
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const getProductById = (id: string) =>
    products.find(p => p.id === id);

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        removeProduct,
        getProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

/* ---------- HOOK ---------- */
export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error("useProducts debe usarse dentro de ProductProvider");
  }
  return ctx;
}