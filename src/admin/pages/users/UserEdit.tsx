import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../../../services/adminService";

export default function UserEdit() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadUser();
    } else {
      navigate("/admin/usuarios");
    }
  }, [id, navigate]);

  const loadUser = async () => {
    if (!id) return;

    try {
      const data = await getUserById(id);
      setUser(data);
      setError(null);
    } catch (error: any) {
      console.error("Error cargando usuario:", error);
      setError(error.message || "Usuario no encontrado");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!id || !user) return;

    const formData = new FormData(e.currentTarget);
    const userData = {
      run: formData.get("run") as string,
      name: formData.get("name") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,  // ← AQUÍ se cambia el rol
    };

    setSaving(true);
    try {
      await updateUser(id, userData);
      navigate("/admin/usuarios");
    } catch (error: any) {
      setError(error.message || "Error al actualizar usuario");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-4">Cargando...</p>;
  
  if (error && !user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate("/admin/usuarios")}
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mt-4">
      <h2>Editar Usuario</h2>
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label fw-bold">RUN</label>
          <input
            name="run"
            className="form-control"
            defaultValue={user.run || ""}
            required
            disabled={saving}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Nombre</label>
          <input
            name="name"
            className="form-control"
            defaultValue={user.name || ""}
            required
            disabled={saving}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Apellido</label>
          <input
            name="lastName"
            className="form-control"
            defaultValue={user.lastName || ""}
            required
            disabled={saving}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            defaultValue={user.email || ""}
            required
            disabled  // Email no se puede cambiar
          />
          <small className="text-muted">El email no se puede modificar</small>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Rol</label>
          <select
            name="role"
            className="form-control"
            defaultValue={user.role || "CLIENTE"}
            required
            disabled={saving}
          >
            <option value="CLIENTE">Cliente</option>
            <option value="ADMIN">Administrador</option>
          </select>
          <small className="text-muted">
            Cambia a "Administrador" para dar acceso al panel de administración
          </small>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary me-2"
          disabled={saving}
        >
          {saving ? "Guardando..." : "Actualizar"}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={() => navigate("/admin/usuarios")}
          disabled={saving}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}