import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`btn btn-sm d-flex align-items-center ${
        theme === "light" 
          ? "btn-dark text-white" 
          : "btn-dark text-primary"
      }`}
      onClick={toggleTheme}
      title="Cambiar tema"
      style={{ gap: 6 }}
    >
      {theme === "light" ? (
        <>
           <span>Oscuro</span>
        </>
      ) : (
        <>
           <span>Claro</span>
        </>
      )}
    </button>
  );
}