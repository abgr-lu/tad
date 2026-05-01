"use client";
import { useEffect, useState } from "react";

export default function AdminCompaniesPage() {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchCompanies = () => {
    fetch("/api/admin/read?table=companies")
      .then((res) => res.json())
      .then((json) => setData(Array.isArray(json) ? json : []));
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const endpoint = editingId ? "/api/admin/update" : "/api/admin/insert";
    const payload = editingId 
      ? { table: "companies", id: editingId, data: formData } 
      : { table: "companies", data: formData };

    const res = await fetch(endpoint, {
      method: method,
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert(editingId ? "Compañía actualizada" : "Compañía guardada");
      cancelEdit();
      e.target.reset();
      fetchCompanies();
    } else {
      alert("Error al procesar la solicitud");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta compañía?")) {
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        body: JSON.stringify({ table: "companies", id }),
      });
      if (res.ok) fetchCompanies();
      else alert("Error al eliminar");
    }
  };

  const inputStyle = { width: "100%", padding: "5px", marginBottom: "10px" };
  const sectionStyle = {
    background: editingId ? "#fffde7" : "#fff",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: editingId ? "2px solid #fbc02d" : "1px solid #ddd",
  };

  return (
    <div style={{ background: "#f0f2f5", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: editingId ? "#fbc02d" : "#000" }}>
        {editingId ? `Editando: ${formData.name}` : "Gestión de Compañías"}
      </h1>

      <form onSubmit={handleSubmit}>
        {/* SECCIÓN 1: IDENTIFICACIÓN */}
        <div style={sectionStyle}>
          <h3 style={{ color: "#0070f3" }}>1. Identificación y Tickers</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px" }}>
            <div>
              <label>Name</label>
              <input type="text" required value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label>Ticker 1</label>
              <input type="text" required value={formData.ticket_1 || ""} onChange={(e) => setFormData({ ...formData, ticket_1: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label>Ticker 2</label>
              <input type="text" value={formData.ticket_2 || ""} onChange={(e) => setFormData({ ...formData, ticket_2: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label>Ticker 3</label>
              <input type="text" value={formData.ticket_3 || ""} onChange={(e) => setFormData({ ...formData, ticket_3: e.target.value })} style={inputStyle} />
            </div>
          </div>
          <label>Logo URL</label>
          <input type="text" value={formData.logo_url || ""} placeholder="https://..." onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })} style={inputStyle} />
        </div>

        {/* SECCIÓN 2: VALORACIÓN Y RATIOS */}
        <div style={sectionStyle}>
          <h3 style={{ color: "#0070f3" }}>2. Métricas de Mercado y Ratios</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
            {["price", "mcap", "ev", "pnav", "ev_ebitda", "per", "fcf", "eps", "divi", "divi_yield"].map((field) => (
              <div key={field}>
                <label>{field.toUpperCase()}</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData[field] || 0}
                  onChange={(e) => setFormData({ ...formData, [field]: parseFloat(e.target.value) || 0 })}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN 3: FLOTA Y TCE */}
        <div style={sectionStyle}>
          <h3 style={{ color: "#0070f3" }}>3. Flota y TCE Equivalente (VT1 - VT10)</h3>
          <label>TCE Global</label>
          <input type="number" value={formData.tce || 0} onChange={(e) => setFormData({ ...formData, tce: parseInt(e.target.value) || 0 })} style={{ width: "20%", ...inputStyle }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <div key={num} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input type="text" value={formData[`vt${num}`] || ""} placeholder={`Buque Tipo ${num}`} onChange={(e) => setFormData({ ...formData, [`vt${num}`]: e.target.value })} style={inputStyle} />
                <input type="number" value={formData[`tce${num}`] || 0} placeholder="TCE" onChange={(e) => setFormData({ ...formData, [`tce${num}`]: parseInt(e.target.value) || 0 })} style={inputStyle} />
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN 4: MANAGEMENT */}
        <div style={sectionStyle}>
          <h3 style={{ color: "#0070f3" }}>4. Dirección (CEO)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "10px" }}>
            <div>
              <label>CEO Name</label>
              <input type="text" value={formData.ceo_name || ""} onChange={(e) => setFormData({ ...formData, ceo_name: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label>CEO Score (0-100)</label>
              <input type="number" value={formData.ceo_scored || 0} onChange={(e) => setFormData({ ...formData, ceo_scored: parseInt(e.target.value) || 0 })} style={inputStyle} />
            </div>
            <div>
              <label>Scrubber (%)</label>
              <input type="number" step="0.01" value={formData.scrubber || 0} onChange={(e) => setFormData({ ...formData, scrubber: parseFloat(e.target.value) || 0 })} style={inputStyle} />
            </div>
          </div>
          <label>CEO History / Bio</label>
          <textarea value={formData.ceo_history || ""} onChange={(e) => setFormData({ ...formData, ceo_history: e.target.value })} style={{ width: "100%", height: "60px", marginBottom: "10px" }}></textarea>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" style={{ flex: 1, padding: "15px", background: editingId ? "#fbc02d" : "#0070f3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
            {editingId ? "ACTUALIZAR DATOS" : "GUARDAR COMPAÑÍA"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} style={{ padding: "15px", background: "#666", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>CANCELAR</button>
          )}
        </div>
      </form>

      {/* TABLA RESUMIDA */}
      <div style={{ marginTop: "40px", overflowX: "auto", background: "white", padding: "10px", borderRadius: "8px" }}>
        <table border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", fontSize: "12px" }}>
          <thead>
            <tr style={{ background: "#333", color: "white" }}>
              <th>Logo</th><th>Nombre</th><th>Tickers</th><th>Price</th><th>Mcap</th><th>EV/EBITDA</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr key={c.id} style={{ background: editingId === c.id ? "#fffde7" : "transparent" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <td>{c.logo_url && <img src={c.logo_url} alt="logo" style={{ height: "20px" }} />}</td>
                <td>{c.name}</td><td>{c.ticket_1}</td><td>{c.price}</td><td>{c.mcap}</td><td>{c.ev_ebitda}x</td>
                <td>
                  <button onClick={() => startEdit(c)} style={{ background: "#007bff", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", marginRight: "5px", cursor: "pointer" }}>Editar</button>
                  <button onClick={() => handleDelete(c.id)} style={{ background: "#ff4d4d", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
