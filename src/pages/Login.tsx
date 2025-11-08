import React from "react";
import LoginForm from "../components/forms/LoginForm";
import { Link } from "react-router-dom";

export default function Login(){
  return (
    <div className="row justify-content-center">
      <div className="col-md-4">
        <div className="card p-4">
          <h3>Iniciar Sesión</h3>
          <LoginForm />
          
          {/* Agrega este div con el enlace de registro */}
          <div className="text-center mt-3">
            <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}