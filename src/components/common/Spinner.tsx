import React from "react";

export default function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "spinner-border-sm",
    md: "",
    lg: "spinner-border-lg",
  };

  return (
    <div className="d-flex justify-content-center align-items-center p-3">
      <div
        className={`spinner-border text-primary ${sizes[size]}`}
        role="status"
      >
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );
}
