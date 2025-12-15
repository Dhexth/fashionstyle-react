// src/pages/Register.tsx
import React from "react";
import RegisterForm from "../components/forms/RegisterForm";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-3">
              <h3 className="text-center mb-3">Crear Cuenta</h3>
              
              <RegisterForm />
              
              <div className="text-center mt-3 pt-3 border-top">
                <small>
                  ¿Ya tienes cuenta?{" "}
                  <Link to="/login" className="text-decoration-none fw-semibold">
                    Inicia sesión aquí
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