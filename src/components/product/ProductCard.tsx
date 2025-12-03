import React, { useState } from "react";
import { Product } from "../../types/product";
import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "../../contexts/CartContext";
import { Link } from "react-router-dom";

export default function ProductCard({ product }: { product: Product }) {
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Manejar error de imagen MEJORADO
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    setImageError(true);
    target.src = "https://via.placeholder.com/300x300/EFEFEF/666666?text=Imagen+no+disponible";
    console.warn(`Imagen no cargada: ${product.name}`);
  };

  // Agregar al carrito MEJORADO
  const handleAddToCart = () => {
    // Validar stock
    if (product.stock !== undefined && product.stock <= 0) {
      console.warn(' Producto agotado, no se puede agregar');
      return;
    }
    
    dispatch({ 
      type: "ADD", 
      payload: { ...product, quantity: 1 } 
    });
    
    console.log(`${product.name} agregado al carrito`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Calcular si está agotado
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <div className={`card h-100 shadow-sm ${added ? 'border-success' : ''}`}>
      {/* Imagen con loading state */}
      <div style={{ height: '250px', overflow: 'hidden', position: 'relative' }}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="card-img-top"
          style={{ 
            height: '100%', 
            width: '100%',
            objectFit: imageError ? 'contain' : 'cover',
            padding: imageError ? '20px' : '0'
          }}
          onError={handleImageError}
          loading="lazy" // Mejora performance
        />
        {/* Badge de agregado */}
        {added && (
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-success">¡Agregado!</span>
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        {/* Nombre del producto */}
        <h5 
          className="card-title" 
          style={{ minHeight: '48px' }}
          title={product.name}
        >
          {product.name}
        </h5>

        {/* Precio */}
        <p className="card-text text-primary fw-bold h5 mb-2">
          {formatPrice(product.price)}
        </p>
        
        {/* Categoría */}
        {product.category && (
          <span className="badge bg-secondary mb-2 align-self-start">
            {product.category}
          </span>
        )}
        
        {/* Stock */}
        {product.stock !== undefined && (
          <small className={`text-${isOutOfStock ? 'danger' : 'success'} mb-2`}>
            {isOutOfStock ? 'Agotado' : ` ${product.stock} disponibles`}
          </small>
        )}
        
        {/* Botones */}
        <div className="mt-auto d-flex gap-2">
          <button 
            className={`btn ${added ? 'btn-success' : 'btn-primary'} flex-fill`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            title={isOutOfStock ? 'Producto agotado' : 'Agregar al carrito'}
          >
            {isOutOfStock ? 'Agotado' : (added ? '✓ Agregado' : 'Agregar al Carrito')}
          </button>
          
          <Link 
            className="btn btn-outline-secondary" 
            to={`/productos/${product.id}`}
            title="Ver detalles del producto"
          >
             Ver
          </Link>
        </div>
      </div>
    </div>
  );
}