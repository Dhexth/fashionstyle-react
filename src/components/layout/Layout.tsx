// src/components/layout/Layout.tsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="container my-4 pt-5">
        {children}
      </main>
      <Footer />
    </>
  );
}