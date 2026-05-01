"use client";
import { useEffect, useState } from "react";

export default function AdminVsalesPage() {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    sector: "",
    type: "",
    name: "",
    dwt: 0,
    year_b: 2000,
    yard: "",
    country: "",
    buyer: "",
    price: 0,
    scrubber: false,
    comments: "",
    year_r: new Date().getFullYear(),
    week: 1,
    status: "",
  });

  const fetchSales = () => {
    fetch("/api/admin/read?table=vsales")
      .then((res) => res.json())
      .then((json) => setData(Array.isArray(json) ? json : []));
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      sector: "", type: "", name: "", dwt: 0, year_b: 2000,
      yard: "", country: "", buyer: "", price: 0,
      scrubber: false, comments: "", year_r: new Date().getFullYear(),
      week: 1, status: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const endpoint = editingId ? "/api/admin/update" : "/api/admin/insert";
    const payload = editingId 
      ? { table: "vsales", id: editingId, data: formData } 
      : { table: "vsales", data: formData };

    const res = await fetch(endpoint, {
      method: method,
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert(editingId ? "Venta actualizada" : "Venta añadida");
      cancelEdit();
      e.target.reset();
      fetchSales();
    } else {
      alert("Error al procesar la solicitud");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        body: JSON.stringify({ table: "vsales", id }),
      });

      if (res.ok) {
        fetchSales();
      } else {
        alert("Error al eliminar");
      }
    }
  };

  return (
    <div>
      <h1 style={{ color: editingId ? "#1976d2" : "black" }}>
        {editingId ? `Editando Buque: ${formData.name}` : "Gestión de Vessel Sales (Tabla vsales)"}
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          background: editingId ? "#e1f5fe" : "#e3f2fd",
          padding: "20px",
          borderRadius: "8px",
          border: editingId ? "2px solid #1976d2" : "1px solid #bbdefb",
        }}
      >
        <div style={{ gridColumn: "span 2" }}>
          <label>Nombre del Buque</label>
          <input
            type="text"
            required
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Sector</label>
          <input
            type="text"
            required
            value={formData.sector || ""}
            onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Tipo</label>
          <input
            type="text"
            required
            value={formData.type || ""}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label>DWT</label>
          <input
            type="number"
            required
            value={formData.dwt || 0}
            onChange={(e) => setFormData({ ...formData, dwt: parseInt(e.target.value) || 0 })}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Año Construcción</label>
          <input
            type="number"
            required
            value={formData.year_b || 0}
            onChange={(e) => setFormData({ ...formData, year_b: parseInt(e.target.value) || 0 })}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Astillero (Yard)</label>
          <input
            type="text"
            value={formData.yard || ""}
            onChange={(e) => setFormData({ ...formData, yard: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>País</label>
          <input
            type="text"
            value={formData.country || ""}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label>Comprador</label>
          <input
            type="text"
            value={formData.buyer || ""}
            onChange={(e) => setFormData({ ...formData, buyer: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Precio (M$)</label>
          <input
            type="number"
            step="0.01"
            value={formData.price || 0}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "20px" }}>
          <label>Scrubber</label>
          <input
            type="checkbox"
            checked={formData.scrubber || false}
            onChange={(e) => setFormData({ ...formData, scrubber: e.target.checked })}
          />
        </div>
        <div>
          <label>Estado</label>
          <input
            type="text"
            value={formData.status || ""}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ gridColumn: "span 2" }}>
          <label>Comentarios</label>
          <input
            type="text"
            value={formData.comments || ""}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Año Reporte</label>
          <input
            type="number"
            value={formData.year_r || 0}
            onChange={(e) => setFormData({ ...formData, year_r: parseInt(e.target.value) || 0 })}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Semana</label>
          <input
            type="number"
            value={formData.week || 0}
            onChange={(e) => setFormData({ ...formData, week: parseInt(e.target.value) || 0 })}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ gridColumn: "span 4", display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{ flex: 1, padding: "12px", background: editingId ? "#0288d1" : "#1976d2", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
          >
            {editingId ? "ACTUALIZAR VENTA" : "AÑADIR VENTA"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} style={{ padding: "12px", background: "#666", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              CANCELAR
            </button>
          )}
        </div>
      </form>

      <div style={{ marginTop: "30px", overflowX: "auto" }}>
        <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "center" }}>
          <thead style={{ background: "#0d47a1", color: "white" }}>
            <tr>
              <th>ID</th><th>Buque</th><th>Sector</th><th>DWT</th><th>Año B.</th><th>Precio</th><th>Scrub.</th><th>Buyer</th><th>Año R.</th><th>Sem</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} style={{ background: editingId === item.id ? "#e1f5fe" : "transparent" }}>
                <td>{item.id}</td>
                <td style={{ textAlign: "left", fontWeight: "bold" }}>{item.name}</td>
                <td>{item.sector}</td>
                <td>{item.dwt?.toLocaleString()}</td>
                <td>{item.year_b}</td>
                <td style={{ color: "green", fontWeight: "bold" }}>{item.price} M</td>
                <td>{item.scrubber ? "✅" : "❌"}</td>
                <td>{item.buyer || "-"}</td>
                <td>{item.year_r}</td>
                <td>{item.week}</td>
                <td style={{ display: "flex", gap: "5px", justifyContent: "center", padding: "5px" }}>
                  <button onClick={() => startEdit(item)} style={{ background: "#007bff", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Editar</button>
                  <button onClick={() => handleDelete(item.id)} style={{ background: "#ff4d4d", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
