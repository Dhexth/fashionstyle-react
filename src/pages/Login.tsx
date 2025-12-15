import React from "react";
import LoginForm from "../components/forms/LoginForm";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="text-center mb-4">Iniciar Sesión</h3>
              
              {/* Formulario de login */}
              <LoginForm />
              
              {/* Enlace de registro - SOLO UNO */}
              <div className="text-center mt-4 pt-3 border-top">
                <small>
                  ¿No tienes cuenta?{" "}
                  <Link to="/register" className="text-decoration-none fw-semibold">
                    Regístrate aquí
                  </Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}