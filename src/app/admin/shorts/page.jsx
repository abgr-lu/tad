"use client";
import { useEffect, useState } from "react";

export default function AdminShortsPage() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    company: "",
    symbol: "",
    market: "",
    current_short: 0,
    previous_short: 0,
    outstanding: 0,
    float: 0,
    av_vol: 0,
    date: new Date().toISOString().split("T")[0], // Fecha de hoy por defecto
  });

  const fetchShorts = () => {
    fetch("/api/admin/read?table=shorts")
      .then((res) => res.json())
      .then((json) => setData(Array.isArray(json) ? json : []));
  };

  useEffect(() => {
    fetchShorts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/admin/insert", {
      method: "POST",
      body: JSON.stringify({ table: "shorts", data: formData }),
    });
    fetchShorts();
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        body: JSON.stringify({ table: "shorts", id }), // Cambia 'companies' por la tabla que toque
      });

      if (res.ok) {
        // 1. Limpia el objeto en memoria (importante para que el siguiente no herede datos)
        setFormData({});
        // 2. Limpia los inputs visualmente (quita el texto de las cajas)
        e.target.reset();
        // 3. Refresca la lista de abajo
        fetchShorts(); // O la función que uses para recargar la lista
      } else {
        alert("Error al eliminar");
      }
    }
  };

  return (
    <div>
      <h1>Gestión de Short Interest (Tabla shorts)</h1>

      {/* FORMULARIO */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "15px",
          background: "#fff3e0",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #ffe0b2",
        }}
      >
        <div>
          <label>Company</label>
          <input
            type="text"
            required
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Symbol (Ticker)</label>
          <input
            type="text"
            required
            onChange={(e) =>
              setFormData({ ...formData, symbol: e.target.value })
            }
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Market</label>
          <input
            type="text"
            required
            onChange={(e) =>
              setFormData({ ...formData, market: e.target.value })
            }
            style={{ width: "100%" }}
          />
        </div>

        {[
          "current_short",
          "previous_short",
          "outstanding",
          "float",
          "av_vol",
        ].map((field) => (
          <div key={field}>
            <label>{field.replace("_", " ").toUpperCase()}</label>
            <input
              type="number"
              required
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [field]: parseInt(e.target.value) || 0,
                })
              }
              style={{ width: "100%" }}
            />
          </div>
        ))}

        <div>
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            required
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>

        <button
          type="submit"
          style={{
            gridColumn: "span 3",
            padding: "12px",
            background: "#fb8c00",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Registrar Posición Short
        </button>
      </form>

      {/* TABLA */}
      <div style={{ marginTop: "30px" }}>
        <table
          border="1"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
          }}
        >
          <thead style={{ background: "#e65100", color: "white" }}>
            <tr>
              <th>ID</th>
              <th>Company</th>
              <th>Symbol</th>
              <th>Market</th>
              <th>Current</th>
              <th>Previous</th>
              <th>Outst.</th>
              <th>Float</th>
              <th>Avg Vol</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td style={{ textAlign: "left", padding: "4px" }}>
                  {item.company}
                </td>
                <td>{item.symbol}</td>
                <td>{item.market}</td>
                <td>{item.current_short.toLocaleString()}</td>
                <td>{item.previous_short.toLocaleString()}</td>
                <td>{item.outstanding.toLocaleString()}</td>
                <td>{item.float.toLocaleString()}</td>
                <td>{item.av_vol.toLocaleString()}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
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
