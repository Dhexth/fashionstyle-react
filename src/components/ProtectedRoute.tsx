import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, loading } = useAuth();

  // ⏳ Esperar a que cargue la sesión
  if (loading) {
    return null; // o spinner
  }

  // ❌ No autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ No es admin
  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // ✅ Autorizado
  return children;
}
