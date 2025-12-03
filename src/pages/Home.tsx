import React, { useEffect, useState } from "react";
import { fetchFeaturedProducts, fetchProducts } from "../services/productService";
import ProductGrid from "../components/product/ProductGrid";
import { Product } from "../types/product";
import { Link } from "react-router-dom";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => { 
    const loadHomeData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Iniciando carga de datos para home...');
        
        // Intentar cargar productos destacados específicos
        let products: Product[];
        
        try {
          products = await fetchFeaturedProducts();
          console.log(`${products.length} productos destacados cargados`);
        } catch (featuredError) {
          console.warn('No se pudieron cargar destacados, usando productos normales');
          // Fallback: cargar todos y tomar los primeros 6
          const allProducts = await fetchProducts();
          products = allProducts.slice(0, 6);
        }
        
        setFeaturedProducts(products);
        
      } catch (error: any) {
        console.error('Error cargando datos del home:', error);
        setError("No se pudieron cargar los productos. Intenta recargar la página.");
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // Estado de carga
  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando los mejores productos para ti...</p>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-warning">
          <h4>No se pudieron cargar los productos</h4>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Sección Hero */}
      <section 
        className="py-5 text-center text-white mb-5 position-relative hero-section"
        style={{
          backgroundImage: "url('/images/hero/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "400px",
          display: "flex",
          alignItems: "center"
        }}
      >
        <div className="hero-overlay"></div>
        
        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">Moda para todos los estilos</h1>
              <p className="lead mb-4">
                Descubre las últimas tendencias en moda y encuentra tu estilo único con nuestra colección exclusiva.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/productos" className="btn btn-primary btn-lg">
                  Comprar Ahora
                </Link>
                <Link to="/nosotros" className="btn btn-outline-light btn-lg">
                  Conoce Más
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de productos destacados */}
      <section className="container mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold text-primary mb-3">Productos Destacados</h2>
              <p className="lead text-muted">Lo más vendido y mejor valorado por nuestra comunidad</p>
            </div>
            
            {featuredProducts.length === 0 ? (
              <div className="text-center py-5">
                <div className="text-muted mb-3">
                  <i className="bi bi-inbox display-1"></i>
                </div>
                <h4>No hay productos destacados</h4>
                <p className="text-muted mb-4">Pronto tendremos novedades para ti</p>
                <Link to="/productos" className="btn btn-primary">
                  Explorar Todos los Productos
                </Link>
              </div>
            ) : (
              <>
                <ProductGrid products={featuredProducts} />
                
                <div className="text-center mt-5">
                  <Link to="/productos" className="btn btn-primary btn-lg px-5">
                    Ver Todos los Productos 
                    <span className="badge bg-light text-primary ms-2">
                      {featuredProducts.length}+
                    </span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Estilos CSS para la sección hero */}
      <style>{`
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.6);
          z-index: 1;
        }
        .hero-section .container {
          z-index: 2;
        }
      `}</style>
    </>
  );
}