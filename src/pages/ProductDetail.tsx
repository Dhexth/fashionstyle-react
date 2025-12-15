import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { useParams } from "react-router-dom";
import { fetchProductById } from "../services/productServiceApi"; 
=======
import { useParams, Link } from "react-router-dom";
import { fetchProductById } from "../services/productService";
>>>>>>> 75f8f3f15a27a3446e1090fabd83bb4f30218949
import { Product } from "../types/product";
import { useCart } from "../contexts/CartContext";
import { formatPrice } from "../utils/formatPrice";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useCart();

  useEffect(() => {
<<<<<<< HEAD
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
=======
    const loadProduct = async () => {
      if (!id) {
        setError("ID de producto no válido");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log(`Iniciando carga del producto ID: ${id}`);
        
        // DIAGNÓSTICO COMPLETO
        console.log(`Probando conexión con: http://localhost:8080/api/v1/productos/${id}`);
        
        const testResponse = await fetch(`http://localhost:8080/api/v1/productos/${id}`);
        console.log(`Status de respuesta: ${testResponse.status} ${testResponse.statusText}`);
        
        if (testResponse.status === 404) {
          throw new Error(`Producto con ID ${id} no encontrado en el servidor`);
        }
        
        if (!testResponse.ok) {
          throw new Error(`Error del servidor: ${testResponse.status} ${testResponse.statusText}`);
        }
        
        const rawData = await testResponse.json();
        console.log('Datos crudos del backend:', rawData);
        
        // Ahora usar el servicio normal
        const productData = await fetchProductById(id);
        
        if (productData) {
          setProduct(productData);
          console.log('Producto cargado exitosamente:', productData);
        } else {
          throw new Error('El servicio devolvió null - posible error en transformación');
        }
        
      } catch (error: any) {
        console.error('Error completo:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch({ 
        type: "ADD", 
        payload: { ...product, quantity: 1 } 
      });
      alert(`¡${product.name} agregado al carrito!`);
    }
  };

  // Verificar si el producto tiene stock disponible
  const hasStock = product && (product.stock === undefined || product.stock > 0);

  if (loading) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando producto...</span>
          </div>
          <p className="mt-2">Cargando información del producto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-warning text-center">
          <h4>Producto no disponible</h4>
          <p>{error}</p>
          <div className="mt-3">
            <Link to="/productos" className="btn btn-primary me-2">
              Volver a productos
            </Link>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="alert alert-danger text-center">
          <h4>Producto no encontrado</h4>
          <p>El producto que buscas no existe o ha sido removido.</p>
          <Link to="/productos" className="btn btn-primary">
            Ver todos los productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Inicio</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/productos">Productos</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Imagen del producto */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <img 
              src={product.image} 
              alt={product.name}
              className="card-img-top img-fluid"
              style={{ 
                maxHeight: '500px', 
                objectFit: 'cover',
                width: '100%'
              }}
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/500x500/EFEFEF/666666?text=Imagen+no+disponible";
              }}
            />
          </div>
        </div>

        {/* Información del producto */}
        <div className="col-md-6">
          <div className="product-details">
            <h1 className="h2 fw-bold text-primary">{product.name}</h1>
            
            <div className="mb-3">
              <span className="h3 text-primary fw-bold">{formatPrice(product.price)}</span>
              {product.category && (
                <span className="badge bg-secondary ms-2">{product.category}</span>
              )}
            </div>

            <div className="mb-4">
              <p className="lead">{product.description}</p>
            </div>

            {/* Stock information */}
            {product.stock !== undefined && (
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge ${hasStock ? 'bg-success' : 'bg-danger'}`}>
                    {hasStock ? 'En stock' : 'Agotado'}
                  </span>
                  {hasStock && (
                    <small className="text-muted">
                      {product.stock} unidades disponibles
                    </small>
                  )}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="d-flex gap-3 mb-4">
              <button 
                className="btn btn-primary btn-lg flex-fill"
                onClick={handleAddToCart}
                disabled={!hasStock}
              >
                {hasStock ? 'Agregar al carrito' : 'Producto agotado'}
              </button>
            </div>

            {/* Información adicional */}
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Información del producto</h6>
                <ul className="list-unstyled small">
                  <li className="mb-2">
                    Envío gratis en compras sobre $50.000
                  </li>
                  <li className="mb-2">
                    Devolución gratuita hasta 30 días
                  </li>
                  <li>
                    Pago 100% seguro
                  </li>
                </ul>
              </div>
            </div>

            {/* Botón de diagnóstico temporal */}
            <div className="mt-4">
              <button 
                className="btn btn-outline-info btn-sm"
                onClick={() => {
                  console.log('Estado actual:', { id, product, loading, error });
                  fetch(`http://localhost:8080/api/v1/productos/${id}`)
                    .then(r => r.json())
                    .then(data => console.log('Respuesta manual:', data))
                    .catch(err => console.error('Error manual:', err));
                }}
              >
                Ver Diagnóstico en Consola
              </button>
            </div>
          </div>
>>>>>>> 75f8f3f15a27a3446e1090fabd83bb4f30218949
        </div>
      </div>
    </div>
  );
}