"use client";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    premium: false,
    super: false,
    created_at: "",
    subscription_ends_at: ""
  });

  const fetchUsers = () => {
    fetch("/api/admin/read?table=users")
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const startEdit = (user) => {
    setEditingId(user.id);
    setFormData(user);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", email: "", country: "", premium: false, super: false, created_at: "", subscription_ends_at: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Usamos PUT para actualizar el usuario
    const res = await fetch("/api/admin/update", {
      method: "PUT",
      body: JSON.stringify({ table: "users", id: editingId, data: formData }),
    });

    if (res.ok) {
      alert("Usuario actualizado");
      cancelEdit();
      fetchUsers();
    } else {
      alert("Error al actualizar");
    }
  };

  const toggleStatus = async (userId, field, currentValue) => {
    await fetch("/api/admin/update", {
      method: "PUT", 
      body: JSON.stringify({
        table: "users",
        id: userId,
        data: { [field]: !currentValue },
      }),
    });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar a este usuario?")) {
      const res = await fetch("/api/admin/delete", {
        method: "POST", 
        body: JSON.stringify({ table: "users", id }),
      });

      if (res.ok) {
        fetchUsers();
      } else {
        alert("Error al eliminar");
      }
    }
  };

  // Funciones auxiliares para manejar el formato de fecha del input datetime-local
  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    try {
      return new Date(isoString).toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  const handleDateChange = (field, value) => {
    setFormData({ 
      ...formData, 
      [field]: value ? new Date(value).toISOString() : null 
    });
  };

  return (
    <div>
      <h1 style={{ color: editingId ? 'blue' : 'inherit' }}>
        {editingId ? `Editando Perfil: ${formData.email}` : "Gestión de Usuarios"}
      </h1>

      {/* FORMULARIO DE EDICIÓN */}
      {editingId && (
        <form onSubmit={handleSubmit} style={{ background: '#e3f2fd', color: 'black', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #2196f3' }}>
          <h3>Editar Datos Básicos</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ fontWeight: 'bold', fontSize: '12px' }}>Nombre</label>
              <input type="text" value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} style={{width: '100%', color: 'black', padding: '5px'}} />
            </div>
            
            <div>
              <label style={{ fontWeight: 'bold', fontSize: '12px' }}>Email</label>
              <input type="email" value={formData.email || ""} onChange={e => setFormData({...formData, email: e.target.value})} style={{width: '100%', color: 'black', padding: '5px'}} />
            </div>
            
            <div>
              <label style={{ fontWeight: 'bold', fontSize: '12px' }}>País</label>
              <input type="text" value={formData.country || ""} onChange={e => setFormData({...formData, country: e.target.value})} style={{width: '100%', color: 'black', padding: '5px'}} />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', fontSize: '12px' }}>Fecha de Registro</label>
              <input 
                type="datetime-local" 
                value={formatDateForInput(formData.created_at)} 
                onChange={e => handleDateChange('created_at', e.target.value)} 
                style={{width: '100%', color: 'black', padding: '5px'}} 
              />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', fontSize: '12px' }}>Fecha de Expiración</label>
              <input 
                type="datetime-local" 
                value={formatDateForInput(formData.subscription_ends_at)} 
                onChange={e => handleDateChange('subscription_ends_at', e.target.value)} 
                style={{width: '100%', color: 'black', padding: '5px'}} 
              />
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ background: '#2196f3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>ACTUALIZAR</button>
            <button type="button" onClick={cancelEdit} style={{ background: '#666', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>CANCELAR</button>
          </div>
        </form>
      )}

      <table border="1" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead style={{ background: "#333", color: "white" }}>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Premium</th>
            <th>Super</th>
            <th>País</th>
            <th>Registro</th>
            <th>Expiración</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr 
              key={u.id} 
              style={{ 
                textAlign: "center", 
                background: editingId === u.id ? '#e3f2fd' : 'transparent',
                color: editingId === u.id ? 'black' : 'inherit' // Soluciona la visibilidad del texto
              }}
            >
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <input type="checkbox" checked={u.premium || false} onChange={() => toggleStatus(u.id, "premium", u.premium)} />
              </td>
              <td>
                <input type="checkbox" checked={u.super || false} onChange={() => toggleStatus(u.id, "super", u.super)} />
              </td>
              <td>{u.country || "-"}</td>
              <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}</td>
              <td>{u.subscription_ends_at ? new Date(u.subscription_ends_at).toLocaleDateString() : "-"}</td>
              <td style={{ display: 'flex', gap: '5px', justifyContent: 'center', padding: '5px' }}>
                <button onClick={() => startEdit(u)} style={{ background: "#007bff", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Editar</button>
                <button onClick={() => handleDelete(u.id)} style={{ background: "#ff4d4d", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
