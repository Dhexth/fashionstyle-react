import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useTheme } from "../../contexts/ThemeContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div data-bs-theme={theme}>
      <Header />
      <main className="container my-4">{children}</main>
      <Footer />
    </div>
  );
}