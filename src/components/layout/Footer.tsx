import React from "react";
import { Link } from "react-router-dom";

export default function Footer(){
  return (
    <footer className="bg-dark text-light mt-5 py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="text-primary">FashionStyle</h5>
            <p className="mb-0">Tu tienda de confianza para encontrar las últimas tendencias en moda a precios increíbles.</p>
          </div>
          <div className="col-md-4 mb-4 mb-md-0">
            <h6 className="text-primary mb-3">Enlaces Rápidos</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none footer-link">Inicio</Link>
              </li>
              <li className="mb-2">
                <Link to="/productos" className="text-light text-decoration-none footer-link">Productos</Link>
              </li>
              <li className="mb-2">
                <Link to="/nosotros" className="text-light text-decoration-none footer-link">Nosotros</Link>
              </li>
              <li className="mb-2">
                <Link to="/blog" className="text-light text-decoration-none footer-link">Blog</Link>
              </li>
              <li className="mb-2">
                <Link to="/contacto" className="text-light text-decoration-none footer-link">Contacto</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="text-primary mb-3">Contacto</h6>
            <div className="mb-2">+56256987412</div>
            <div className="mb-2">info@fashionstyle.com</div>
            <div className="mb-2">Calle Principal 123, Ciudad</div>
          </div>
        </div>
        <div className="text-center mt-4 pt-3 border-top border-secondary">
          <small>© 2025 FashionStyle</small>
        </div>
      </div>

      {/* Estilos para el hover */}
      <style>{`
        .footer-link {
          transition: color 0.3s ease;
        }
        .footer-link:hover {
          color: #0d6efd !important;
        }
      `}</style>
    </footer>
  );
}