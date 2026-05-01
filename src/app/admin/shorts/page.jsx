"use client";
import { useEffect, useState } from "react";

export default function AdminShortsPage() {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    company: "",
    symbol: "",
    market: "",
    current_short: 0,
    previous_short: 0,
    outstanding: 0,
    float: 0,
    av_vol: 0,
    date: new Date().toISOString().split("T")[0],
  });

  const fetchShorts = () => {
    fetch("/api/admin/read?table=shorts")
      .then((res) => res.json())
      .then((json) => setData(Array.isArray(json) ? json : []));
  };

  useEffect(() => {
    fetchShorts();
  }, []);

  const startEdit = (item) => {
    setEditingId(item.id);
    // Formateamos la fecha para que el input type="date" la reconozca (YYYY-MM-DD)
    const formattedDate = new Date(item.date).toISOString().split("T")[0];
    setFormData({ ...item, date: formattedDate });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      company: "", symbol: "", market: "", current_short: 0,
      previous_short: 0, outstanding: 0, float: 0, av_vol: 0,
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const endpoint = editingId ? "/api/admin/update" : "/api/admin/insert";
    const payload = editingId 
      ? { table: "shorts", id: editingId, data: formData } 
      : { table: "shorts", data: formData };

    const res = await fetch(endpoint, {
      method: method,
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert(editingId ? "Actualizado correctamente" : "Guardado correctamente");
      cancelEdit();
      fetchShorts();
    } else {
      alert("Error al procesar la solicitud");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        body: JSON.stringify({ table: "shorts", id }),
      });
      if (res.ok) fetchShorts();
      else alert("Error al eliminar");
    }
  };

  return (
    <div>
      <h1 style={{ color: editingId ? '#e65100' : 'black' }}>
        {editingId ? `Editando Short: ${formData.symbol}` : "Gestión de Short Interest (Tabla shorts)"}
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "15px",
          background: editingId ? "#fffde7" : "#fff3e0",
          padding: "20px",
          borderRadius: "8px",
          border: editingId ? "2px solid #fb8c00" : "1px solid #ffe0b2",
        }}
      >
        <div>
          <label>Company</label>
          <input
            type="text"
            required
            value={formData.company || ""}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Symbol (Ticker)</label>
          <input
            type="text"
            required
            value={formData.symbol || ""}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Market</label>
          <input
            type="text"
            required
            value={formData.market || ""}
            onChange={(e) => setFormData({ ...formData, market: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>

        {["current_short", "previous_short", "outstanding", "float", "av_vol"].map((field) => (
          <div key={field}>
            <label>{field.replace("_", " ").toUpperCase()}</label>
            <input
              type="number"
              required
              value={formData[field] || 0}
              onChange={(e) => setFormData({ ...formData, [field]: parseInt(e.target.value) || 0 })}
              style={{ width: "100%" }}
            />
          </div>
        ))}

        <div>
          <label>Date</label>
          <input
            type="date"
            required
            value={formData.date || ""}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ gridColumn: "span 3", display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "12px",
              background: editingId ? "#e65100" : "#fb8c00",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {editingId ? "ACTUALIZAR POSICIÓN" : "REGISTRAR POSICIÓN SHORT"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} style={{ padding: "12px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              CANCELAR
            </button>
          )}
        </div>
      </form>

      <div style={{ marginTop: "30px" }}>
        <table border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", fontSize: "14px" }}>
          <thead style={{ background: "#e65100", color: "white" }}>
            <tr>
              <th>ID</th><th>Company</th><th>Symbol</th><th>Market</th><th>Current</th><th>Previous</th><th>Outst.</th><th>Float</th><th>Avg Vol</th><th>Date</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} style={{ background: editingId === item.id ? "#fffde7" : "transparent" }}>
                <td>{item.id}</td>
                <td style={{ textAlign: "left", padding: "4px" }}>{item.company}</td>
                <td>{item.symbol}</td>
                <td>{item.market}</td>
                <td>{Number(item.current_short).toLocaleString()}</td>
                <td>{Number(item.previous_short).toLocaleString()}</td>
                <td>{Number(item.outstanding).toLocaleString()}</td>
                <td>{Number(item.float).toLocaleString()}</td>
                <td>{Number(item.av_vol).toLocaleString()}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td style={{ display: "flex", gap: "5px", justifyContent: "center", padding: "5px" }}>
                  <button onClick={() => startEdit(item)} style={{ background: "#007bff", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(item.id)} style={{ background: "#ff4d4d", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>
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
