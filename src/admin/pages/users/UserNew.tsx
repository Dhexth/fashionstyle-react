import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../../services/adminService";

export default function UserNew() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const userData = {
      run: formData.get("run") as string,
      name: formData.get("name") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as string,
    };

    try {
      await createUser(userData);
      navigate("/admin/usuarios");
    } catch (error: any) {
      setError(error.message || "Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Nuevo Usuario</h2>
      
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
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">RUN</label>
          <input
            name="run"
            className="form-control"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            name="name"
            className="form-control"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Apellido</label>
          <input
            name="lastName"
            className="form-control"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            name="password"
            type="password"
            className="form-control"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Rol</label>
          <select 
            name="role" 
            className="form-control" 
            required
            disabled={loading}
          >
            <option value="CLIENTE">Cliente</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary me-2" 
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={() => navigate("/admin/usuarios")}
          disabled={loading}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}