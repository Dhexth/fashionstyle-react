import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductById } from "../services/productService";
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
        </div>
      </div>
    </div>
  );
}