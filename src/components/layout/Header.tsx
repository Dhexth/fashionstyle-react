import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import CartModal from "../cart/CartModal";
import ThemeSwitch from "../common/ThemeSwitch";

export default function Header() {
  const { state } = useCart();
  const count = state.items.reduce((s, i) => s + i.quantity, 0);
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="bg-body fixed-top shadow-sm">
        <div className="container d-flex align-items-center justify-content-between py-3">
          <Link className="h4 text-primary text-decoration-none" to="/">
            Fashion<span style={{ color: "#ff006e" }}>Style</span>
          </Link>

          <nav>
            <NavLink 
              className={({ isActive }) => 
                `nav-link d-inline-block mx-2 ${isActive ? 'text-primary fw-bold text-decoration-underline' : 'text-body'}`
              } 
              to="/"
            >
              Inicio
            </NavLink>
            <NavLink 
              className={({ isActive }) => 
                `nav-link d-inline-block mx-2 ${isActive ? 'text-primary fw-bold text-decoration-underline' : 'text-body'}`
              } 
              to="/productos"
            >
              Productos
            </NavLink>
            <NavLink 
              className={({ isActive }) => 
                `nav-link d-inline-block mx-2 ${isActive ? 'text-primary fw-bold text-decoration-underline' : 'text-body'}`
              } 
              to="/nosotros"
            >
              Nosotros
            </NavLink>
            <NavLink 
              className={({ isActive }) => 
                `nav-link d-inline-block mx-2 ${isActive ? 'text-primary fw-bold text-decoration-underline' : 'text-body'}`
              } 
              to="/blog"
            >
              Blog
            </NavLink>
            <NavLink 
              className={({ isActive }) => 
                `nav-link d-inline-block mx-2 ${isActive ? 'text-primary fw-bold text-decoration-underline' : 'text-body'}`
              } 
              to="/contacto"
            >
              Contacto
            </NavLink>
          </nav>

          <div className="d-flex align-items-center gap-2">
            <ThemeSwitch />
            
            <Link to="/register" className="btn btn-outline-primary btn-sm">
              Registrarse
            </Link>
            
            <Link to="/login" className="btn btn-primary btn-sm">
              Iniciar sesión
            </Link>

            <button
              className="btn btn-primary btn-sm position-relative"
              onClick={() => setOpen(true)}
            >
              🛒 <span className="ms-2">Carrito</span>
              {count > 0 && (
                <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 2000, right: 12, top: 84 }}
        >
          <div className="card" style={{ width: 380 }}>
            <div className="card-body">
              <CartModal onClose={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}