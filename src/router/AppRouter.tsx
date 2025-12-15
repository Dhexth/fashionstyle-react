// src/router/AppRouter.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// --- RUTAS PÚBLICAS ---
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Blog from "../pages/Blog";
import BlogArticle from "../pages/BlogArticle";
import Login from "../pages/Login";
import Register from "../pages/Register";

// --- COMPONENTES ADMIN ---
import AdminLayout from "../admin/AdminLayout";
import AdminHome from "../admin/pages/AdminHome";

// Productos (Admin)
import ProductList from "../admin/pages/products/ProductList";
import ProductNew from "../admin/pages/products/ProductNew";
import ProductEdit from "../admin/pages/products/ProductEdit";

// Usuarios (Admin)
import UserList from "../admin/pages/users/UserList";
import UserNew from "../admin/pages/users/UserNew";
import UserEdit from "../admin/pages/users/UserEdit";

// 🟢 Gestión de Carritos (Admin) - NUEVO
import AdminCartManager from "../admin/pages/AdminCartManager"; 

// --- PROTECCIÓN ---
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>

      {/* ----------------- RUTAS PÚBLICAS ----------------- */}
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Products />} />
      <Route path="/productos/:id" element={<ProductDetail />} />
      <Route path="/nosotros" element={<About />} />
      <Route path="/contacto" element={<Contact />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogArticle />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ----------------- RUTAS ADMIN (Protegidas) ----------------- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard Principal */}
        <Route index element={<AdminHome />} />

        {/* Gestión de Productos */}
        <Route path="productos" element={<ProductList />} />
        <Route path="productos/nuevo" element={<ProductNew />} />
        <Route path="productos/editar/:id" element={<ProductEdit />} />

        {/* Gestión de Usuarios */}
        <Route path="usuarios" element={<UserList />} />
        <Route path="usuarios/nuevo" element={<UserNew />} />
        <Route path="usuarios/editar/:id" element={<UserEdit />} />

        {/* 🛒 Gestión de Carritos Activos (MySQL Laragon) */}
        <Route path="carritos" element={<AdminCartManager />} />
      </Route>

      {/* Redirección por defecto si la ruta no existe */}
      <Route path="*" element={<Home />} />

    </Routes>
  );
}