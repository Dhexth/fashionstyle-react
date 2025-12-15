import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProductsFromApi, deleteProductFromApi } from "../../../services/productServiceApi";

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchProductsFromApi();
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const eliminar = async (id: number | string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) return;
    try {
      await deleteProductFromApi(id);
      setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
    } catch (error) {
      console.error("Error al eliminar");
    }
  };

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
      {/* Texto de carga adaptativo */}
      <p className="mt-2 text-secondary-emphasis">Cargando catálogo...</p>
    </div>
  );

  return (
    <div className="container mt-4 pb-5">
      {/* Encabezado Principal */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="fw-bold mb-0 text-primary-emphasis">
          Gestión de Productos
        </h2>
      </div>

      {products.length === 0 ? (
        /* Estado Vacío - Mejorado para Modo Oscuro */
        <div className="card border-0 shadow-sm text-center p-5 mt-5 bg-light bg-opacity-10">
          <div className="card-body">
            <div className="mb-3">
              <span style={{ fontSize: '3rem' }}>📦</span>
            </div>
            {/* Texto principal con énfasis */}
            <h4 className="opacity-75">No hay productos registrados</h4>
            {/* Párrafo con opacidad para que no se vea negro en modo oscuro */}
            <p className="opacity-75">Parece que aún no has agregado nada a tu inventario.</p>
            <Link to="/admin/productos/nuevo" className="btn btn-outline-primary mt-2 shadow-sm">
              Comenzar a agregar
            </Link>
          </div>
        </div>
      ) : (
        /* Tabla con Estilo Moderno */
        <div className="card border-0 shadow-lg overflow-hidden bg-transparent">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-nowrap">
              <thead className="table-dark">
                <tr>
                  <th className="py-3 ps-4">CÓDIGO</th>
                  <th className="py-3">NOMBRE</th>
                  <th className="py-3">PRECIO</th>
                  <th className="py-3 text-center">STOCK</th>
                  <th className="py-3">IMAGEN</th>
                  <th className="py-3 text-center pe-4">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="text-secondary-emphasis">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 ps-4">
                      <span className="fw-semibold">{p.code}</span>
                    </td>
                    <td>
                      <span className="fw-semibold">{p.name}</span>
                    </td>
                    <td>
                      <span className="badge bg-success bg-opacity-10 text-success fs-6 border border-success border-opacity-25">
                        ${p.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`fw-bold ${p.stock < 5 ? 'text-danger' : 'text-info-emphasis'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <div 
                        className="rounded-3 shadow-sm border bg-white d-flex align-items-center justify-content-center"
                        style={{ width: '50px', height: '50px', overflow: 'hidden' }}
                      >
                        {p.imageUrl ? (
                          <img 
                            src={`http://localhost:8081${p.imageUrl}`} 
                            alt={p.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://via.placeholder.com/50?text=Err";
                            }}
                          />
                        ) : (
                          <span className="text-muted" style={{ fontSize: '10px' }}>N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="text-center pe-4">
                      <div className="btn-group shadow-sm">
                        <Link to={`/admin/productos/editar/${p.id}`} className="btn btn-warning btn-sm fw-bold">
                          Editar
                        </Link>
                        <button onClick={() => eliminar(p.id)} className="btn btn-danger btn-sm fw-bold">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}