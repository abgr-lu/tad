"use client";
import { useEffect, useState } from "react";

export default function AdminVvPage() {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    sector: "",
    type: "",
    nb: 0,
    5: 0,
    10: 0,
    15: 0,
    20: 0,
    scrap: 0,
    year: new Date().getFullYear(),
    week: 1,
  });

  const fetchVv = () => {
    fetch("/api/admin/read?table=vvalues")
      .then((res) => res.json())
      .then((json) => setData(Array.isArray(json) ? json : []));
  };

  useEffect(() => {
    fetchVv();
  }, []);

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      sector: "",
      type: "",
      nb: 0,
      5: 0,
      10: 0,
      15: 0,
      20: 0,
      scrap: 0,
      year: new Date().getFullYear(),
      week: 1,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const endpoint = editingId ? "/api/admin/update" : "/api/admin/insert";
    const payload = editingId
      ? { table: "vv", id: editingId, data: formData }
      : { table: "vv", data: formData };

    const res = await fetch(endpoint, {
      method: method,
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert(editingId ? "Registro actualizado" : "Registro añadido");
      cancelEdit();
      e.target.reset();
      fetchVv();
    } else {
      alert("Error al procesar la solicitud");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        body: JSON.stringify({ table: "vv", id }),
      });

      if (res.ok) {
        fetchVv();
      } else {
        alert("Error al eliminar");
      }
    }
  };

  return (
    <div>
      <h1 style={{ color: editingId ? "#0070f3" : "black" }}>
        {editingId
          ? `Editando V-Value ID: ${editingId}`
          : "Gestión de V-Values (Tabla vv)"}
      </h1>

      {/* FORMULARIO */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          background: editingId ? "#e3f2fd" : "#f4f4f4",
          padding: "20px",
          borderRadius: "8px",
          border: editingId ? "2px solid #0070f3" : "none",
        }}
      >
        <div style={{ gridColumn: "span 2" }}>
          <label>Sector</label>
          <select
            required
            value={formData.sector || ""}
            onChange={(e) =>
              setFormData({ ...formData, sector: e.target.value })
            }
            style={{ width: "100%", padding: "5px" }} // Añadí un pequeño padding para que se vea mejor
          >
            <option value="" disabled>
              Seleccione un sector
            </option>
            <option value="Tankers">Tankers</option>
            <option value="DB">DB</option>
          </select>
        </div>
        <div>
          <label>Type</label>
          <input
            type="text"
            required
            value={formData.type || ""}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>NB</label>
          <input
            type="number"
            step="0.1"
            required
            value={formData.nb || 0}
            onChange={(e) =>
              setFormData({ ...formData, nb: parseFloat(e.target.value) || 0 })
            }
            style={{ width: "100%" }}
          />
        </div>
        {/* Campos Numéricos */}
        {["5", "10", "15", "20", "scrap"].map((val) => (
          <div key={val}>
            <label>{val.toUpperCase()}</label>
            <input
              type="number"
              step="0.1"
              required
              value={formData[val] || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [val]: parseFloat(e.target.value) || 0,
                })
              }
              style={{ width: "100%" }}
            />
          </div>
        ))}
        <div>
          <label>Año</label>
          <input
            type="number"
            value={formData.year || 0}
            onChange={(e) =>
              setFormData({ ...formData, year: parseInt(e.target.value) || 0 })
            }
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Semana</label>
          <input
            type="number"
            min="1"
            max="53"
            value={formData.week || 0}
            onChange={(e) =>
              setFormData({ ...formData, week: parseInt(e.target.value) || 0 })
            }
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ gridColumn: "span 4", display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "10px",
              background: editingId ? "#0056b3" : "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {editingId ? "ACTUALIZAR REGISTRO" : "AÑADIR REGISTRO"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{
                padding: "10px",
                background: "#666",
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

      {/* TABLA DE DATOS */}
      <div style={{ marginTop: "30px", overflowX: "auto" }}>
        <table
          border="1"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead style={{ background: "#eee" }}>
            <tr>
              <th>ID</th>
              <th>Sector</th>
              <th>Type</th>
              <th>NB</th>
              <th>5</th>
              <th>10</th>
              <th>15</th>
              <th>20</th>
              <th>Scrap</th>
              <th>Año</th>
              <th>Sem</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                style={{
                  textAlign: "center",
                  background: editingId === item.id ? "#e3f2fd" : "transparent",
                }}
              >
                <td>{item.id}</td>
                <td style={{ textAlign: "left", padding: "5px" }}>
                  {item.sector}
                </td>
                <td>{item.type}</td>
                <td>{item.nb}</td>
                <td>{item["5"]}</td>
                <td>{item["10"]}</td>
                <td>{item["15"]}</td>
                <td>{item["20"]}</td>
                <td>{item.scrap}</td>
                <td>{item.year}</td>
                <td>{item.week}</td>
                <td
                  style={{
                    display: "flex",
                    gap: "5px",
                    justifyContent: "center",
                    padding: "5px",
                  }}
                >
                  <button
                    onClick={() => startEdit(item)}
                    style={{
                      background: "#007bff",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
    </div>
  );
}
