// src/components/common/ThemeSwitch.tsx
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`btn btn-sm d-flex align-items-center ${
        theme === "light" 
          ? "btn-outline-dark" 
          : "btn-outline-light"
      }`}
      onClick={toggleTheme}
      title={theme === "light" ? "Cambiar a tema oscuro" : "Cambiar a tema claro"}
      style={{ gap: 6 }}
      aria-label="Cambiar tema"
    >
      {theme === "light" ? (
        <>
          <i className="bi bi-moon"></i>
          <span className="d-none d-md-inline">Oscuro</span>
        </>
      ) : (
        <>
          <i className="bi bi-sun"></i>
          <span className="d-none d-md-inline">Claro</span>
        </>
      )}
    </button>
  );
}