import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductsFromApi, updateProductFromApi } from "../../../services/productServiceApi";
import { formatPrice } from "../../../utils/formatPrice";

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const apiProducts = await fetchProductsFromApi();
        const found = apiProducts?.find((p: any) => String(p.id) === String(id));
        if (!found) return navigate("/admin/productos");
        
        // 🟢 Aseguramos que el precio sea un entero para evitar el error del navegador
        const cleanPrice = Math.round(Number(found.price));
        setProduct({ ...found, price: cleanPrice });
        setCurrentPrice(cleanPrice);
      } catch (error) {
        console.error("Error cargando producto:", error);
        navigate("/admin/productos");
      }
    }
    load();
  }, [id, navigate]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await updateProductFromApi(id!, formData);
      navigate("/admin/productos");
    } catch (error) {
      console.error("Error actualizando producto:", error);
    }
  };

  if (!product) return <div className="container mt-5 text-light">Cargando...</div>;

  return (
    <div className="container mt-4 pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h2 className="text-white fw-bold">Editar Producto</h2>
      </div>

      <form onSubmit={submit} className="card bg-dark p-4 border-secondary shadow">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="text-info small fw-bold">CÓDIGO</label>
            <input name="code" className="form-control bg-dark text-white border-secondary" defaultValue={product.code} required />
          </div>

          <div className="col-md-6 mb-3">
            <label className="text-info small fw-bold">NOMBRE DEL PRODUCTO</label>
            <input name="name" className="form-control bg-dark text-white border-secondary" defaultValue={product.name} required />
          </div>

          <div className="col-12 mb-3">
            <label className="text-info small fw-bold">DESCRIPCIÓN</label>
            <textarea name="description" className="form-control bg-dark text-white border-secondary" defaultValue={product.description} rows={3} required />
          </div>

          <div className="col-md-6 mb-3">
            <label className="text-info small fw-bold">PRECIO (CLP)</label>
            <div className="input-group">
              <span className="input-group-text bg-secondary border-secondary text-white">$</span>
              <input 
                name="price" 
                type="number" 
                // 🟢 CLAVE: step="1" elimina el error de "valor válido" y decimales
                step="1" 
                className="form-control bg-dark text-white border-secondary" 
                defaultValue={product.price} 
                onChange={(e) => setCurrentPrice(Number(e.target.value))}
                required 
              />
            </div>
            <div className="form-text text-success fw-bold">
              Vista previa: {formatPrice(currentPrice)}
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <label className="text-info small fw-bold">STOCK ACTUAL</label>
            <input name="stock" type="number" step="1" className="form-control bg-dark text-white border-secondary" defaultValue={product.stock} required />
          </div>

          <div className="col-md-6 mb-3">
            <label className="text-info small fw-bold">CATEGORÍA</label>
            <select name="category" className="form-select bg-dark text-white border-secondary" defaultValue={product.category} required>
              <option value="">Seleccione categoría</option>
              <option value="Ropa">Ropa</option>
              <option value="Calzado">Calzado</option>
            </select>
          </div>

          <div className="col-md-6 mb-4">
            <label className="text-info small fw-bold">CAMBIAR IMAGEN (OPCIONAL)</label>
            <input type="file" name="image" className="form-control bg-dark text-white border-secondary" accept="image/*" />
          </div>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary px-4 fw-bold shadow-sm">Actualizar Producto</button>
          <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate("/admin/productos")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}