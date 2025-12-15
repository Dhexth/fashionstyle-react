import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers, deleteUser } from "../../../services/adminService";

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      try {
        await deleteUser(id);
        loadUsers();
      } catch (error) {
        console.error("Error eliminando usuario:", error);
        alert("No se pudo eliminar el usuario");
      }
    }
  };

  if (loading) return <p className="text-center mt-4">Cargando usuarios...</p>;

  return (
    <div className="container mt-4">
      <h2>Usuarios</h2>
      <Link className="btn btn-primary mb-3" to="/admin/usuarios/nuevo">
        Nuevo Usuario
      </Link>

      {users.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>RUN</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id}>
                <td>{user.run}</td>
                <td>{user.name} {user.lastName}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-secondary'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/admin/usuarios/editar/${user.id}`}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}