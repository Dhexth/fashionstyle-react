// src/admin/AdminLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <main className="admin-content flex-fill p-4">
        <Outlet />
      </main>
    </div>
  );
}
