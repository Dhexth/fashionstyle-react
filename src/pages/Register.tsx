import React from "react";
import RegisterForm from "../components/forms/RegisterForm";

export default function Register(){
  return (
    <div className="row justify-content-center">
      <div className="col-md-4">
        <div className="card p-4">
          <h3>Registro</h3>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
