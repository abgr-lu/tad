"use client";
import { useEffect, useState } from "react";

export default function AdminVsalesPage() {
  const [data, setData] = useState([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/admin/insert", {
      method: "POST",
      body: JSON.stringify({ table: "vsales", data: formData }),
    });
    fetchSales();
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        body: JSON.stringify({ table: "vsales", id }), // Cambia 'companies' por la tabla que toque
      });

      if (res.ok) {
        // 1. Limpia el objeto en memoria (importante para que el siguiente no herede datos)
        setFormData({});
        // 2. Limpia los inputs visualmente (quita el texto de las cajas)
        e.target.reset();
        // 3. Refresca la lista de abajo
        fetchVsales(); // O la función que uses para recargar la lista
      } else {
        alert("Error al eliminar");
      }
    }
  };

  return (
    <div>
      <h1>Gestión de Vessel Sales (Tabla vsales)</h1>

      {/* FORMULARIO */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          background: "#e3f2fd",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #bbdefb",
        }}
      >
        <div style={{ gridColumn: "span 2" }}>
          <label>Nombre del Buque</label>
          <input
            type="text"
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>
        <div>
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
          <label>Tipo</label>
          <input
            type="text"
            required
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label>DWT (Peso muerto)</label>
          <input
            type="number"
            required
            onChange={(e) =>
              setFormData({ ...formData, dwt: parseInt(e.target.value) })
            }
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Año Construcción (year_b)</label>
          <input
            type="number"
            required
            onChange={(e) =>
              setFormData({ ...formData, year_b: parseInt(e.target.value) })
            }
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Astillero (Yard)</label>
          <input
            type="text"
            onChange={(e) => setFormData({ ...formData, yard: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>País</label>
          <input
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label>Comprador (Buyer)</label>
          <input
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, buyer: e.target.value })
            }
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Precio (M$)</label>
          <input
            type="number"
            step="0.01"
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
            style={{ width: "100%" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            paddingTop: "20px",
          }}
        >
          <label>Scrubber</label>
          <input
            type="checkbox"
            onChange={(e) =>
              setFormData({ ...formData, scrubber: e.target.checked })
            }
          />
        </div>
        <div>
          <label>Estado (Status)</label>
          <input
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ gridColumn: "span 2" }}>
          <label>Comentarios</label>
          <input
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, comments: e.target.value })
            }
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Año Reporte (year_r)</label>
          <input
            type="number"
            value={formData.year_r}
            onChange={(e) =>
              setFormData({ ...formData, year_r: parseInt(e.target.value) })
            }
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Semana</label>
          <input
            type="number"
            value={formData.week}
            onChange={(e) =>
              setFormData({ ...formData, week: parseInt(e.target.value) })
            }
            style={{ width: "100%" }}
          />
        </div>

        <button
          type="submit"
          style={{
            gridColumn: "span 4",
            padding: "12px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Añadir Venta
        </button>
      </form>

      {/* TABLA */}
      <div style={{ marginTop: "30px", overflowX: "auto" }}>
        <table
          border="1"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          <thead style={{ background: "#0d47a1", color: "white" }}>
            <tr>
              <th>ID</th>
              <th>Buque</th>
              <th>Sector</th>
              <th>DWT</th>
              <th>Año B.</th>
              <th>Precio</th>
              <th>Scrub.</th>
              <th>Buyer</th>
              <th>Año R.</th>
              <th>Sem</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td style={{ textAlign: "left", fontWeight: "bold" }}>
                  {item.name}
                </td>
                <td>{item.sector}</td>
                <td>{item.dwt?.toLocaleString()}</td>
                <td>{item.year_b}</td>
                <td style={{ color: "green", fontWeight: "bold" }}>
                  {item.price} M
                </td>
                <td>{item.scrubber ? "✅" : "❌"}</td>
                <td>{item.buyer || "-"}</td>
                <td>{item.year_r}</td>
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
