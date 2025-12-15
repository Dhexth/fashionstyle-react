import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginForm() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(form.email, form.password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Correo electrónico</label>
        <input 
          type="email" 
          name="email" 
          className="form-control" 
          value={form.email} 
          onChange={handleChange} 
          required 
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <input 
          type="password" 
          name="password" 
          className="form-control" 
          value={form.password} 
          onChange={handleChange} 
          required 
          disabled={loading}
        />
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Iniciando sesión...
          </>
        ) : "Iniciar sesión"}
      </button>
    </form>
  );
}