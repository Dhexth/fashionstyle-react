import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProductFromApi } from "../../../services/productServiceApi";

export default function ProductNew() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await createProductFromApi(formData);
      // Se eliminó la alerta de éxito
      navigate("/admin/productos");
    } catch (error) {
      console.error("Error al guardar:", error);
      // Se eliminó la alerta de error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-success text-white">
          <h2 className="mb-0 h4">Registrar Nuevo Producto</h2>
        </div>
        <div className="card-body">
          <form onSubmit={submit}>
            <div className="row">
              {/* Código y Nombre */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Código</label>
                <input name="code" className="form-control" placeholder="Ej: PROD-001" required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Nombre del Producto</label>
                <input name="name" className="form-control" placeholder="Ej: Zapatillas Running" required />
              </div>

              {/* Descripción */}
              <div className="col-12 mb-3">
                <label className="form-label">Descripción</label>
                <textarea name="description" className="form-control" rows={3} placeholder="Detalles del producto..." required />
              </div>

              {/* Precio, Stock y Categoría */}
              <div className="col-md-4 mb-3">
                <label className="form-label">Precio</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input name="price" type="number" step="0.01" className="form-control" required />
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Stock</label>
                <input name="stock" type="number" className="form-control" required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Categoría</label>
                <select name="category" className="form-select" required defaultValue="">
                  <option value="" disabled>Seleccione...</option>
                  <option value="Ropa">Ropa</option>
                  <option value="Calzado">Calzado</option>
                </select>
              </div>

              {/* Imagen */}
              <div className="col-12 mb-4">
                <label className="form-label">Imagen del Producto</label>
                <input type="file" name="image" className="form-control" accept="image/*" required />
                <small className="text-muted">Formatos permitidos: JPG, PNG. Máximo 2MB.</small>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate("/admin/productos")}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-success" 
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar Producto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}