import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const getLinkClasses = ({ isActive }: { isActive: boolean }) => {
    let baseClasses = "d-flex align-items-center gap-2 py-2 px-3 rounded mb-1 text-decoration-none";
    
    if (isActive) {
      return baseClasses + " active bg-primary text-white";
    } else {
      // En modo oscuro, los links inactivos deben ser grises claros
      return baseClasses + " text-white-50"; 
    }
  };

  return (
    // 🔴 CAMBIO CLAVE: bg-dark en lugar de bg-body-tertiary
    <aside 
      className="admin-sidebar p-3 border-end bg-dark vh-100"
      style={{ minWidth: '250px', width: '250px' }}
    >
      {/* Cambiamos text-primary por text-light para modo oscuro */}
      <h3 className="mb-4 fw-bold text-light text-center border-secondary border-bottom pb-3">
        ADMIN PANEL
      </h3>

      <nav className="d-flex flex-column">
        {/* Home */}
        <NavLink to="/admin" end className={getLinkClasses}>
          <span>🏠</span> Home
        </NavLink>
        
        <hr className="my-2 border-secondary" />
        
        {/* Inventario */}
        <small className="text-uppercase text-secondary fw-bold mb-2 ps-2" style={{ fontSize: '0.7rem' }}>
          Inventario
        </small>
        <NavLink to="/admin/productos" end className={getLinkClasses}>
          <span>📦</span> Productos
        </NavLink>
        
        <NavLink to="/admin/productos/nuevo" className={getLinkClasses}>
          <span>➕</span> Nuevo Producto
        </NavLink>
        
        <hr className="my-2 border-secondary" />
        
        {/* Usuarios */}
        <small className="text-uppercase text-secondary fw-bold mb-2 ps-2" style={{ fontSize: '0.7rem' }}>
          Usuarios
        </small>
        <NavLink to="/admin/usuarios" end className={getLinkClasses}>
          <span>👥</span> Usuarios
        </NavLink>
        
        <NavLink to="/admin/usuarios/nuevo" className={getLinkClasses}>
          <span>➕</span> Nuevo Usuario
        </NavLink>

        <hr className="my-2 border-secondary" />

        {/* Ventas y Carritos */}
        <small className="text-uppercase text-secondary fw-bold mb-2 ps-2" style={{ fontSize: '0.7rem' }}>
          Ventas y Carritos
        </small>
        <NavLink to="/admin/carritos" className={getLinkClasses}>
          <span>🛒</span> Gestionar Carritos
        </NavLink>
      </nav>
    </aside>
  );
}