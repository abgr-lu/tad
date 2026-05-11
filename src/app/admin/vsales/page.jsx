"use client";
import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function AdminVsalesPage() {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBuyer, setFilterBuyer] = useState("");
  const [filterSector, setFilterSector] = useState("");

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
    status: "Reported", // 1. Cambiado a "Reported" por defecto
  });

  const fetchSales = () => {
    fetch("/api/admin/read?table=vsales")
      .then((res) => res.json())
      .then((json) => setData(Array.isArray(json) ? json : []));
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const [displayLimit, setDisplayLimit] = useState(50);

  // Lógica de filtrado en tiempo real
  const allFiltered = data.filter((item) => {
    const matchesName = (item.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBuyer = (item.buyer || "")
      .toLowerCase()
      .includes(filterBuyer.toLowerCase());
    const matchesSector = filterSector === "" || item.sector === filterSector;
    return matchesName && matchesBuyer && matchesSector;
  });

  const visibleData = allFiltered.slice(0, displayLimit);

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
      status: "Reported", // 1. Mantiene "Reported" al limpiar
    });
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0]; // Tomamos el primer archivo
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const res = await fetch("/api/admin/upload-csv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rows: results.data }),
        });

        if (res.ok) {
          const resData = await res.json();
          alert(resData.message);
          fetchSales(); // Refresca el listado automáticamente
          e.target.value = null; // Limpia el input de archivo
        } else {
          alert("Error al procesar el archivo CSV");
        }
      },
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
      if (res.ok) fetchSales();
    }
  };

  // Estado para guardar los IDs seleccionados
  const [selectedIds, setSelectedIds] = useState([]);

  // Función para marcar/desmarcar un ID
  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Función para seleccionar o deseleccionar todos los filtrados
  const toggleAll = () => {
    if (selectedIds.length === allFiltered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allFiltered.map((item) => item.id));
    }
  };

  // Función para el borrado masivo
  const handleBulkDelete = async () => {
    // 1. Verificamos que haya algo seleccionado
    if (selectedIds.length === 0) return;

    // 2. Confirmación del usuario
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar definitivamente ${selectedIds.length} registros?`,
      )
    ) {
      return;
    }

    try {
      // 3. Petición única a la API optimizada
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "vsales",
          ids: selectedIds, // Enviamos el array de IDs directamente
        }),
      });

      if (res.ok) {
        const result = await res.json();
        alert(result.message || "Registros eliminados correctamente");

        // 4. Limpieza de interfaz
        setSelectedIds([]); // Desmarcamos todos los checkboxes
        fetchSales(); // Refrescamos el listado de la base de datos
      } else {
        const errorData = await res.json();
        alert(
          "Error del servidor: " + (errorData.error || "No se pudo eliminar"),
        );
      }
    } catch (error) {
      console.error("Error en el borrado masivo:", error);
      alert("Error de conexión al intentar eliminar los registros");
    }
  };

  return (
    <div
      style={{ padding: "20px", fontFamily: "sans-serif", fontSize: "14px" }}
    >
      <h1 style={{ color: editingId ? "#1976d2" : "black" }}>
        {editingId
          ? `Editando Buque: ${formData.name}`
          : "Gestión de Vessel Sales (Tabla vsales)"}
      </h1>

      {/* FORMULARIO COMPLETO */}
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
          marginBottom: "40px",
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
          <select
            required
            value={formData.sector || ""}
            onChange={(e) =>
              setFormData({ ...formData, sector: e.target.value })
            }
            style={{ width: "100%", padding: "5px" }}
          >
            <option value="" disabled>
              Seleccione sector
            </option>
            <option value="Tankers">Tankers</option>
            <option value="DB">DB</option>
          </select>
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
            onChange={(e) =>
              setFormData({ ...formData, dwt: parseInt(e.target.value) || 0 })
            }
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Año Construcción</label>
          <input
            type="number"
            required
            value={formData.year_b || 0}
            onChange={(e) =>
              setFormData({
                ...formData,
                year_b: parseInt(e.target.value) || 0,
              })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label>Comprador</label>
          <input
            type="text"
            value={formData.buyer || ""}
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
            value={formData.price || 0}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: parseFloat(e.target.value) || 0,
              })
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
            checked={formData.scrubber || false}
            onChange={(e) =>
              setFormData({ ...formData, scrubber: e.target.checked })
            }
          />
        </div>
        <div>
          <label>Estado</label>
          <input
            type="text"
            value={formData.status || ""}
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
            value={formData.comments || ""}
            onChange={(e) =>
              setFormData({ ...formData, comments: e.target.value })
            }
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Año Reporte</label>
          <input
            type="number"
            value={formData.year_r || 0}
            onChange={(e) =>
              setFormData({
                ...formData,
                year_r: parseInt(e.target.value) || 0,
              })
            }
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Semana</label>
          <input
            type="number"
            value={formData.week || 0}
            onChange={(e) =>
              setFormData({ ...formData, week: parseInt(e.target.value) || 0 })
            }
            style={{ width: "100%" }}
          />
        </div>

        <div
          style={{
            gridColumn: "span 4",
            display: "flex",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              background: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {editingId ? "Actualizar Registro" : "Añadir a Base de Datos"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{
                padding: "10px 20px",
                background: "#757575",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Cancelar Edición
            </button>
          )}
        </div>
      </form>

      <hr />

      <div>
        {/* input del CSV */}
        <div
          style={{
            background: "#e8f5e9",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <h3>Importar CSV</h3>
          <input type="file" accept=".csv" onChange={handleCsvUpload} />
        </div>
      </div>

      {/* SECCIÓN DE FILTROS */}
      <div
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
          margin: "20px 0",
          border: "1px solid #ddd",
        }}
      >
        <h3 style={{ marginTop: 0 }}>🔍 Filtros de Búsqueda</h3>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>
              NOMBRE DEL BARCO
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>
              COMPRADOR (BUYER)
            </label>
            <input
              type="text"
              placeholder="Filtrar comprador..."
              value={filterBuyer}
              onChange={(e) => setFilterBuyer(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div style={{ width: "200px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>
              SECTOR
            </label>
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="">Todos los sectores</option>
              <option value="Tankers">Tankers</option>
              <option value="DB">DB</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterBuyer("");
                setFilterSector("");
              }}
              style={{ padding: "8px 15px", cursor: "pointer" }}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* LISTADO DE BARCOS VENDIDOS - 2. TODOS LOS CAMPOS INCLUIDOS */}

      <div style={{ overflowX: "auto" }}>
        {" "}
        {/* Contenedor para scroll horizontal por si la pantalla es estrecha */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
            fontSize: "12px",
          }}
        >
          <thead>
            <tr style={{ background: "#444", color: "white" }}>
              <th style={{ padding: "8px" }}>
                <input
                  type="checkbox"
                  onChange={toggleAll}
                  checked={
                    selectedIds.length === allFiltered.length &&
                    allFiltered.length > 0
                  }
                />
              </th>
              <th style={{ padding: "8px", textAlign: "left" }}>Nombre</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Sector</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Tipo</th>
              <th style={{ padding: "8px", textAlign: "left" }}>DWT</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Año Const.</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Astillero</th>
              <th style={{ padding: "8px", textAlign: "left" }}>País</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Comprador</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Precio</th>
              <th style={{ padding: "8px", textAlign: "center" }}>Scrub.</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Estado</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Año Rep.</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Sem.</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Comentarios</th>
              <th style={{ padding: "8px", textAlign: "center" }}>Acciones</th>
              <th style={{ padding: "8px", textAlign: "center" }}>
                <button
                  onClick={handleBulkDelete}
                  disabled={selectedIds.length === 0}
                  style={{
                    background: selectedIds.length > 0 ? "#d32f2f" : "#ccc",
                    cursor: selectedIds.length > 0 ? "pointer" : "not-allowed",
                  }}
                >
                  S ({selectedIds.length})
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {allFiltered.map((item) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: "1px solid #eee",
                  background: selectedIds.includes(item.id)
                    ? "#fff9c4"
                    : "transparent",
                }}
              >
                <td style={{ padding: "8px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelection(item.id)}
                  />
                </td>
                <td style={{ padding: "8px" }}>{item.id}</td>
                <td style={{ padding: "8px" }}>
                  <strong>{item.name}</strong>
                </td>
                <td style={{ padding: "8px" }}>{item.sector}</td>
                <td style={{ padding: "8px" }}>{item.type}</td>
                <td style={{ padding: "8px" }}>{item.dwt}</td>
                <td style={{ padding: "8px" }}>{item.year_b}</td>
                <td style={{ padding: "8px" }}>{item.yard || "-"}</td>
                <td style={{ padding: "8px" }}>{item.country || "-"}</td>
                <td style={{ padding: "8px" }}>{item.buyer || "-"}</td>
                <td style={{ padding: "8px" }}>{item.price} M$</td>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  {item.scrubber ? "✅" : "❌"}
                </td>
                <td style={{ padding: "8px" }}>
                  <span
                    style={{
                      background:
                        item.status === "Reported" ? "#e8f5e9" : "#fffde7",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {item.status || "-"}
                  </span>
                </td>
                <td style={{ padding: "8px" }}>{item.year_r}</td>
                <td style={{ padding: "8px" }}>{item.week}</td>
                <td
                  style={{
                    padding: "8px",
                    maxWidth: "150px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={item.comments}
                >
                  {item.comments || "-"}
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  <button
                    onClick={() => startEdit(item)}
                    style={{
                      marginRight: "3px",
                      padding: "3px 6px",
                      background: "#1976d2",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      padding: "3px 6px",
                      background: "#d32f2f",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allFiltered.length > displayLimit && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>
              Mostrando {displayLimit} de {allFiltered.length} barcos
            </p>
            <button
              onClick={() => setDisplayLimit((prev) => prev + 50)}
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                background: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Cargar más registros...
            </button>
          </div>
        )}
      </div>
      {allFiltered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          No se encontraron registros que coincidan con la búsqueda.
        </div>
      )}
    </div>
  );
}
