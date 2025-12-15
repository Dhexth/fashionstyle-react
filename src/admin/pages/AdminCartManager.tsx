import React, { useEffect, useState } from "react";
import { cartApi } from "../../services/cartServiceApi";
import { formatPrice } from "../../utils/formatPrice";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function AdminCartManager() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartApi.fetchItems();
      setItems(data);
    } catch (err: any) {
      console.error("Error:", err);
      setError("No se pudieron cargar los datos del carrito.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadData(); 
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      try {
        await cartApi.updateQty(editingItem.id, editingItem.quantity);
        setEditingItem(null);
        loadData();
      } catch (err) {
        alert("Error al actualizar");
      }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Eliminar "${name}" del carrito?`)) {
      try {
        await cartApi.removeItem(id);
        loadData();
      } catch (err) {
        alert("Error al eliminar");
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("¿Eliminar TODOS los productos del carrito?")) {
      try {
        await cartApi.clearCart();
        loadData();
      } catch (err) {
        alert("Error al vaciar carrito");
      }
    }
  };

  // Calcular totales
  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="p-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando carrito desde MySQL...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <button 
            className="btn btn-warning mt-2"
            onClick={loadData}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 min-vh-100">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">🛒 Carritos Activos</h2>
          <p className="text-muted mb-0">
            {items.length} producto{items.length !== 1 ? 's' : ''} en carrito
          </p>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary"
            onClick={loadData}
            disabled={loading}
          >
            {loading ? '...' : '🔄 Actualizar'}
          </button>
          
          {items.length > 0 && (
            <button 
              className="btn btn-outline-danger"
              onClick={handleClearAll}
            >
              🗑️ Vaciar Todo
            </button>
          )}
        </div>
      </div>

      {/* CONTENIDO */}
      {items.length === 0 ? (
        <div className="text-center p-5 border rounded">
          <div className="display-1 mb-3">🛒</div>
          <h4 className="text-muted mb-3">No hay productos en carritos</h4>
          <p className="text-muted">
            Los productos que los usuarios agreguen al carrito aparecerán aquí.
          </p>
        </div>
      ) : (
        <>
          {/* RESUMEN */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="text-center p-3">
                    <h6 className="text-muted mb-2">Productos diferentes</h6>
                    <h3 className="text-primary">{items.length}</h3>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center p-3 border-start">
                    <h6 className="text-muted mb-2">Total unidades</h6>
                    <h3 className="text-warning">{calculateTotalItems()}</h3>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center p-3 border-start">
                    <h6 className="text-muted mb-2">Valor total</h6>
                    <h3 className="text-success">{formatPrice(calculateTotal())}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TABLA */}
          <div className="table-responsive shadow-sm rounded">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID DB</th>
                  <th>Producto</th>
                  <th className="text-center">Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Subtotal</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="align-middle">
                    <td>
                      <div className="d-flex flex-column">
                        <small className="text-muted">DB: #{item.id}</small>
                        <small className="text-primary">Ref: {item.productId}</small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={item.image} 
                          width="50" 
                          height="50"
                          className="rounded border object-fit-cover"
                          alt={item.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50';
                          }}
                        />
                        <div>
                          <div className="fw-bold">{item.name}</div>
                          <small className="text-muted">ID: {item.productId}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-primary fs-6 px-3">{item.quantity}</span>
                    </td>
                    <td>{formatPrice(item.price)}</td>
                    <td className="fw-bold text-success">{formatPrice(item.price * item.quantity)}</td>
                    <td className="text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <button 
                          className="btn btn-sm btn-warning"
                          onClick={() => setEditingItem(item)}
                        >
                          ✏️ Editar
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item.id, item.name)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="text-end fw-bold">TOTAL:</td>
                  <td className="fw-bold fs-5 text-success">{formatPrice(calculateTotal())}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}

      {/* MODAL DE EDICIÓN */}
      {editingItem && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleUpdate}>
                <div className="modal-header">
                  <h5 className="modal-title">✏️ Editar cantidad</h5>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={() => setEditingItem(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="text-center mb-4">
                    <img 
                      src={editingItem.image} 
                      width="100" 
                      height="100"
                      className="rounded border mb-3 object-fit-cover"
                      alt={editingItem.name}
                    />
                    <h5>{editingItem.name}</h5>
                    <p className="text-muted mb-0">ID: {editingItem.productId}</p>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Cantidad:</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={editingItem.quantity}
                      onChange={e => setEditingItem({
                        ...editingItem, 
                        quantity: Math.max(1, parseInt(e.target.value) || 1)
                      })}
                      min="1"
                      required
                      autoFocus
                    />
                    <div className="d-flex justify-content-between mt-2">
                      <small className="text-muted">Precio unitario: {formatPrice(editingItem.price)}</small>
                      <small className="text-primary">
                        Subtotal: {formatPrice(editingItem.price * editingItem.quantity)}
                      </small>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setEditingItem(null)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    ✅ Actualizar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}