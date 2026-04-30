"use client";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/admin/read?table=users")
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []));
  }, []);

  const toggleStatus = async (userId, field, currentValue) => {
    // API que crearemos para actualizar campos rápidos
    await fetch("/api/admin/update", {
      method: "PATCH",
      body: JSON.stringify({
        table: "users",
        id: userId,
        data: { [field]: !currentValue },
      }),
    });
    window.location.reload();
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        body: JSON.stringify({ table: "users", id }), // Cambia 'companies' por la tabla que toque
      });

      if (res.ok) {
        // 1. Limpia el objeto en memoria (importante para que el siguiente no herede datos)
        setFormData({});
        // 2. Limpia los inputs visualmente (quita el texto de las cajas)
        e.target.reset();
        // 3. Refresca la lista de abajo
        fetchUsers(); // O la función que uses para recargar la lista
      } else {
        alert("Error al eliminar");
      }
    }
  };

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <table
        border="1"
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead style={{ background: "#333", color: "white" }}>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Premium</th>
            <th>Super</th>
            <th>País</th>
            <th>Registro</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ textAlign: "center" }}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <input
                  type="checkbox"
                  checked={u.premium}
                  onChange={() => toggleStatus(u.id, "premium", u.premium)}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={u.super}
                  onChange={() => toggleStatus(u.id, "super", u.super)}
                />
              </td>
              <td>{u.country || "-"}</td>
              <td>{new Date(u.created_at).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => handleDelete(u.id)}
                  style={{
                    background: "#ff4d4d",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
