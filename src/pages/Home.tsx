import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/productServiceApi";
import ProductGrid from "../components/product/ProductGrid";
import { Product } from "../types/product";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => { 
    fetchProducts().then(setProducts); 
  }, []);

  // Filtrar solo los productos destacados (primeros 3 como ejemplo)
  const featuredProducts = products.slice(0, 3);

  return (
    <>
      {/* Sección Hero con overlay más oscuro */}
      <section 
        className="py-5 text-center text-white mb-5 position-relative"
        style={{
          backgroundImage: "url('/images/hero/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "400px",
          display: "flex",
          alignItems: "center"
        }}
      >
        {/* Overlay más oscuro para mejor contraste */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1
          }}
        ></div>
        
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">Moda para todos los estilos</h1>
              <p className="lead mb-4">
                Descubre las últimas tendencias en moda y encuentra tu estilo único con nuestra colección exclusiva.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de productos destacados */}
      <section className="container mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <h2 className="text-center mb-4">Productos Destacados</h2>
            <ProductGrid products={featuredProducts} />
            
            {/* Botón "Ver todos los productos" */}
            <div className="text-center mt-4">
              <Link 
                to="/productos" 
                className="btn btn-primary btn-lg"
              >
                Ver todos los productos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}