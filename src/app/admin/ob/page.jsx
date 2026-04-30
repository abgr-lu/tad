"use client";
import { useEffect, useState } from "react";

export default function AdminObPage() {
  const [data, setData] = useState([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/admin/insert", {
      method: "POST",
      body: JSON.stringify({ table: "ob", data: formData }),
    });
    fetchOb();
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        body: JSON.stringify({ table: "ob", id }),
      });

      if (res.ok) {
        // 1. Limpia el objeto en memoria (importante para que el siguiente no herede datos)
        setFormData({});
        // 2. Limpia los inputs visualmente (quita el texto de las cajas)
        e.target.reset();
        // 3. Refresca la lista de abajo
        fetchOb(); // O la función que uses para recargar la lista
      } else {
        alert("Error al eliminar");
      }
    }
  };

  return (
    <div>
      <h1>Gestión de Order Book (Tabla ob)</h1>

      {/* FORMULARIO */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      >
        <div style={{ gridColumn: "span 2" }}>
          <label>Sector</label>
          <input
            type="text"
            required
            onChange={(e) =>
              setFormData({ ...formData, sector: e.target.value })
            }
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <label>Type</label>
          <input
            type="text"
            required
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>

        {/* Años dinámicos */}
        {["2025", "2026", "2027", "2028", "2029", "2030", "beyond"].map(
          (year) => (
            <div key={year}>
              <label>{year.toUpperCase()}</label>
              <input
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [year]: parseInt(e.target.value) || 0,
                  })
                }
                style={{ width: "100%" }}
              />
            </div>
          ),
        )}

        {/* Totales */}
        <div>
          <label>Total Ord</label>
          <input
            type="number"
            onChange={(e) =>
              setFormData({
                ...formData,
                total_ord: parseInt(e.target.value) || 0,
              })
            }
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Total Units</label>
          <input
            type="number"
            onChange={(e) =>
              setFormData({
                ...formData,
                total_units: parseInt(e.target.value) || 0,
              })
            }
            style={{ width: "100%" }}
          />
        </div>

        <button
          type="submit"
          style={{
            gridColumn: "span 4",
            padding: "12px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Guardar en Order Book
        </button>
      </form>

      {/* TABLA */}
      <div style={{ marginTop: "30px", overflowX: "auto" }}>
        <table
          border="1"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          <thead style={{ background: "#343a40", color: "white" }}>
            <tr>
              <th>ID</th>
              <th>Sector</th>
              <th>Type</th>
              <th>2025</th>
              <th>2026</th>
              <th>2027</th>
              <th>2028</th>
              <th>2029</th>
              <th>2030</th>
              <th>Beyond</th>
              <th>Total Ord</th>
              <th>Total Units</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td style={{ textAlign: "left", padding: "4px" }}>
                  {item.sector}
                </td>
                <td>{item.type}</td>
                <td>{item["2025"]}</td>
                <td>{item["2026"]}</td>
                <td>{item["2027"]}</td>
                <td>{item["2028"]}</td>
                <td>{item["2029"]}</td>
                <td>{item["2030"]}</td>
                <td>{item.beyond}</td>
                <td>{item.total_ord}</td>
                <td>{item.total_units}</td>
                <td>
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
