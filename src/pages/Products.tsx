// src/pages/Products.tsx
import React, { useEffect, useState } from "react";
import ProductGrid from "../components/product/ProductGrid";
import { fetchProducts, searchProducts, fetchProductsByCategory } from "../services/productService";
import { Product } from "../types/product";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => { 
    loadAllProducts();
  }, []);

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const productsData = await fetchProducts();
      console.log(`${productsData.length} productos cargados exitosamente`);
      
      if (productsData.length === 0) {
        setError("No se encontraron productos en el servidor");
      }
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      
    } catch (error: any) {
      console.error('Error cargando productos:', error);
      setError("No se pudieron cargar los productos. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos cuando cambia la búsqueda o categoría
  useEffect(() => {
    let filtered = products;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  // Obtener categorías únicas
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))] as string[];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        setLoading(true);
        const results = await searchProducts(searchTerm);
        setFilteredProducts(results);
      } catch (error) {
        console.error('Error buscando productos:', error);
        // Fallback a filtrado local
        const localResults = products.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(localResults);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    if (category) {
      try {
        setLoading(true);
        const results = await fetchProductsByCategory(category);
        setFilteredProducts(results);
      } catch (error) {
        console.error('Error cargando productos por categoría:', error);
        // Fallback a filtrado local
        const localResults = products.filter(product =>
          product.category?.toLowerCase() === category.toLowerCase()
        );
        setFilteredProducts(localResults);
      } finally {
        setLoading(false);
      }
    } else {
      setFilteredProducts(products);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setFilteredProducts(products);
  };

  if (loading && products.length === 0) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando productos...</span>
          </div>
          <p className="mt-3">Cargando nuestro catálogo...</p>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="container">
        <div className="alert alert-warning text-center">
          <h4>No se pudieron cargar los productos</h4>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={loadAllProducts}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-5 fw-bold text-primary">Nuestros Productos</h1>
          <p className="lead text-muted">
            Descubre nuestra colección completa
            {products.length > 0 && (
              <span className="badge bg-primary ms-2">
                {products.length} productos
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="row mb-4">
        <div className="col-md-6">
          <form onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar productos por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Buscar
              </button>
            </div>
          </form>
        </div>
        
        <div className="col-md-4">
          <select 
            className="form-select"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <button 
            className="btn btn-outline-secondary w-100"
            onClick={clearFilters}
            disabled={!searchTerm && !selectedCategory}
          >
            Limpiar
          </button>
        </div>

        {(searchTerm || selectedCategory) && (
          <div className="col-12 mt-3">
            <div className="alert alert-info py-2">
              <small>
                Mostrando {filteredProducts.length} de {products.length} productos
                {searchTerm && ` para "${searchTerm}"`}
                {selectedCategory && ` en categoría "${selectedCategory}"`}
              </small>
            </div>
          </div>
        )}
      </div>

      {/* Loading durante búsqueda/filtrado */}
      {loading && products.length > 0 && (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Buscando...</span>
          </div>
          <small className="text-muted ms-2">Buscando productos...</small>
        </div>
      )}

      {/* Productos */}
      {filteredProducts.length === 0 && !loading ? (
        <div className="text-center py-5">
          <div className="text-muted mb-3">
            <i className="bi bi-search display-1"></i>
          </div>
          <h4>No se encontraron productos</h4>
          <p className="text-muted">
            {searchTerm || selectedCategory 
              ? "No hay productos que coincidan con tu búsqueda. Prueba con otros términos."
              : "No hay productos disponibles en este momento."
            }
          </p>
          {(searchTerm || selectedCategory) && (
            <button 
              className="btn btn-primary"
              onClick={clearFilters}
            >
              Ver todos los productos
            </button>
          )}
        </div>
      ) : (
        <>
          <ProductGrid products={filteredProducts} />
          
          {/* Contador de resultados */}
          <div className="row mt-4">
            <div className="col">
              <p className="text-muted text-center">
                {filteredProducts.length === products.length 
                  ? `Mostrando todos los ${products.length} productos`
                  : `Mostrando ${filteredProducts.length} de ${products.length} productos`
                }
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}