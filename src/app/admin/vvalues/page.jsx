"use client";
import { useEffect, useState } from "react";

export default function AdminVvPage() {
  const [data, setData] = useState([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/admin/insert", {
      method: "POST",
      body: JSON.stringify({ table: "vv", data: formData }),
    });
    fetchVv(); // Recargar lista
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        body: JSON.stringify({ table: "vv", id }), // Cambia 'companies' por la tabla que toque
      });

      if (res.ok) {
        // 1. Limpia el objeto en memoria (importante para que el siguiente no herede datos)
        setFormData({});
        // 2. Limpia los inputs visualmente (quita el texto de las cajas)
        e.target.reset();
        // 3. Refresca la lista de abajo
        fetchVv(); // O la función que uses para recargar la lista
      } else {
        alert("Error al eliminar");
      }
    }
  };

  return (
    <div>
      <h1>Gestión de V-Values (Tabla vv)</h1>

      {/* FORMULARIO DE INSERCIÓN */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          background: "#f4f4f4",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <div className="col-span-2">
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
        <div>
          <label>Type</label>
          <input
            type="text"
            required
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
            onChange={(e) => setFormData({ ...formData, nb: e.target.value })}
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
              onChange={(e) =>
                setFormData({ ...formData, [val]: e.target.value })
              }
              style={{ width: "100%" }}
            />
          </div>
        ))}
        <div>
          <label>Año</label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Semana</label>
          <input
            type="number"
            min="1"
            max="53"
            onChange={(e) => setFormData({ ...formData, week: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>
        <button
          type="submit"
          style={{
            gridColumn: "span 4",
            padding: "10px",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Añadir Registro
        </button>
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
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} style={{ textAlign: "center" }}>
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
