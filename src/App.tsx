import React, { useEffect } from "react";
import AppRouter from "./router/AppRouter";
import Layout from "./components/layout/Layout";

export default function App() {
  useEffect(() => {
    // Cargar tema guardado al iniciar la aplicación
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-bs-theme', savedTheme);
    } else {
      // Tema por defecto
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }
  }, []);

  return (
    <Layout>
      <AppRouter />
    </Layout>
  );
}