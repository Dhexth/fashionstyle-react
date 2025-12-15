// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) return stored;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    // 1. Actualizar el atributo data-bs-theme en html (para Bootstrap 5)
    document.documentElement.setAttribute('data-bs-theme', theme);
    
    // 2. También mantener las clases en body (para compatibilidad con tu CSS actual)
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    
    // 3. Forzar actualización de componentes Bootstrap
    // Este truco hace que Bootstrap recalcule los estilos
    const forceRefresh = () => {
      const originalTheme = document.documentElement.getAttribute('data-bs-theme');
      document.documentElement.setAttribute('data-bs-theme', '');
      setTimeout(() => {
        document.documentElement.setAttribute('data-bs-theme', originalTheme || 'light');
      }, 10);
    };
    
    // Ejecutar después de un pequeño delay para asegurar que el DOM se actualizó
    setTimeout(forceRefresh, 50);
    
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};