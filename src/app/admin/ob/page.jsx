"use client";
import { useEffect, useState } from "react";

export default function AdminObPage() {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null); // ID del registro que estamos editando
  const [formData, setFormData] = useState({
    sector: "",
    type: "",
    2025: 0,
    2026: 0,
    2027: 0,
    2028: 0,
    2029: 0,
    2030: 0,
    beyond: 0,
    total_ord: 0,
    total_units: 0,
  });

  const fetchOb = () => {
    fetch("/api/admin/read?table=ob")
      .then((res) => res.json())
      .then((json) => setData(Array.isArray(json) ? json : []));
  };

  useEffect(() => {
    fetchOb();
  }, []);

  // Función para cargar los datos en el formulario al pulsar Editar
  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube al formulario
  };

  // Función para cancelar la edición
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      sector: "", type: "", 2025: 0, 2026: 0, 2027: 0, 2028: 0, 2029: 0, 2030: 0, beyond: 0, total_ord: 0, total_units: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Si hay editingId usamos PUT (update), si no POST (insert)
    const method = editingId ? "PUT" : "POST";
    const endpoint = editingId ? "/api/admin/update" : "/api/admin/insert";
    const payload = editingId 
      ? { table: "ob", id: editingId, data: formData } 
      : { table: "ob", data: formData };

    const res = await fetch(endpoint, {
      method: method,
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert(editingId ? "Registro actualizado" : "Registro guardado");
      cancelEdit(); // Limpia el formulario y el ID de edición
      fetchOb();
    } else {
      alert("Error al procesar la solicitud");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        body: JSON.stringify({ table: "ob", id }),
      });

      if (res.ok) {
        fetchOb();
      } else {
        alert("Error al eliminar");
      }
    }
  };

  return (
    <div>
      <h1 style={{ color: editingId ? 'orange' : 'black' }}>
        {editingId ? `Editando ID: ${editingId}` : "Gestión de Order Book (Tabla ob)"}
      </h1>

      {/* FORMULARIO CON INPUTS CONTROLADOS */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          background: editingId ? "#fff3e0" : "#f8f9fa", // Cambia de color al editar
          padding: "20px",
          borderRadius: "8px",
          border: editingId ? "2px solid orange" : "1px solid #ddd",
        }}
      >
        <div style={{ gridColumn: "span 2" }}>
          <label>Sector</label>
          <input
            type="text"
            required
            value={formData.sector || ""}
            onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <label>Type</label>
          <input
            type="text"
            required
            value={formData.type || ""}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>

        {["2025", "2026", "2027", "2028", "2029", "2030", "beyond"].map((year) => (
          <div key={year}>
            <label>{year.toUpperCase()}</label>
            <input
              type="number"
              value={formData[year] || 0}
              onChange={(e) => setFormData({ ...formData, [year]: parseInt(e.target.value) || 0 })}
              style={{ width: "100%" }}
            />
          </div>
        ))}

        <div>
          <label>Total Ord</label>
          <input
            type="number"
            value={formData.total_ord || 0}
            onChange={(e) => setFormData({ ...formData, total_ord: parseInt(e.target.value) || 0 })}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Total Units</label>
          <input
            type="number"
            value={formData.total_units || 0}
            onChange={(e) => setFormData({ ...formData, total_units: parseInt(e.target.value) || 0 })}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ gridColumn: "span 4", display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "12px",
              background: editingId ? "#fb8c00" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {editingId ? "ACTUALIZAR REGISTRO" : "GUARDAR EN ORDER BOOK"}
          </button>
          
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{
                padding: "12px",
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              CANCELAR
            </button>
          )}
        </div>
      </form>

      {/* TABLA */}
      <div style={{ marginTop: "30px", overflowX: "auto" }}>
        <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "center" }}>
          <thead style={{ background: "#343a40", color: "white" }}>
            <tr>
              <th>ID</th><th>Sector</th><th>Type</th><th>2025</th><th>2026</th><th>2027</th><th>2028</th><th>2029</th><th>2030</th><th>Beyond</th><th>Total Ord</th><th>Total Units</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} style={{ background: editingId === item.id ? "#fff3e0" : "transparent" }}>
                <td>{item.id}</td>
                <td style={{ textAlign: "left", padding: "4px" }}>{item.sector}</td>
                <td>{item.type}</td>
                <td>{item["2025"]}</td><td>{item["2026"]}</td><td>{item["2027"]}</td><td>{item["2028"]}</td><td>{item["2029"]}</td><td>{item["2030"]}</td>
                <td>{item.beyond}</td><td>{item.total_ord}</td><td>{item.total_units}</td>
                <td style={{ display: "flex", gap: "5px", justifyContent: "center", padding: "5px" }}>
                  <button
                    onClick={() => startEdit(item)}
                    style={{ background: "#007bff", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ background: "#ff4d4d", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
