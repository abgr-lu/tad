"use client";
import { useEffect, useState, useCallback } from "react";
import Papa from "papaparse";
import { STYLES, COLORS } from "@/lib/ui-constants";

export default function AdminVSalesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  const loadData = useCallback(async (isNewSearch = false) => {
    const currentOffset = isNewSearch ? 0 : offset;
    const url = `/api/admin/read?table=vsales&limit=${LIMIT}&offset=${currentOffset}&search=${search}`;
    
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (Array.isArray(json)) {
        if (isNewSearch) {
          setData(json);
          setOffset(LIMIT);
        } else {
          setData(prev => [...prev, ...json]);
          setOffset(currentOffset + LIMIT);
        }
        setHasMore(json.length === LIMIT);
      }
    } catch (error) {
      console.error("Error cargando vsales:", error);
    }
  }, [offset, search]);

  useEffect(() => {
    const timer = setTimeout(() => loadData(true), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    loadingVideoDelay();

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const validRows = results.data.filter(row => 
          row.sector && row.sector.trim() !== "" && 
          row.name && row.name.trim() !== ""
        );

        const formattedData = validRows.map(row => ({
          sector: row.sector.trim(),
          type: row.type,
          name: row.name.trim(),
          dwt: parseInt(row.dwt) || 0,
          year_b: parseInt(row.year_b) || 0,
          yard: row.yard || "",
          country: row.country || "",
          buyer: row.buyer || "",
          price: parseFloat(row.price) || null,
          scrubber: row.scrubber?.toLowerCase() === 'true',
          comments: row.comments || "",
          year_r: parseInt(row.year_r) || 0,
          week: parseInt(row.week) || 0,
          status: row.status || "Reported"
        }));

        if (formattedData.length === 0) {
          alert("No se encontraron registros válidos en el CSV.");
          setLoading(false);
          return;
        }

        try {
          const res = await fetch("/api/admin/bulk-insert", {
            method: "POST",
            body: JSON.stringify({ table: "vsales", data: formattedData }),
          });
          if (res.ok) {
            alert("Datos actualizados correctamente.");
            loadData(true);
          } else {
            const errorText = await res.text();
            alert("Error en la subida: " + errorText);
          }
        } catch (error) {
          console.error("Error upload:", error);
        } finally {
          setLoading(false);
          e.target.value = ""; 
        }
      }
    });
  };

  const loadingVideoDelay = () => setLoading(true);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar registro?")) return;
    try {
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        body: JSON.stringify({ table: "vsales", id })
      });
      if (res.ok) setData(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error delete:", error);
    }
  };

  // Mapeo simétrico de cabeceras asignando anchos porcentuales estrictos (Suman 100%)
  const headers = [
    { label: "Sector", width: "5%" },
    { label: "Type", width: "7%" },
    { label: "Ship Name", width: "10%" },
    { label: "DWT", width: "7%" },
    { label: "Built", width: "4%" },
    { label: "Yard", width: "12%" },
    { label: "Country", width: "5%" },
    { label: "Buyer", width: "10%" },
    { label: "Price", width: "6%" },
    { label: "Scrub.", width: "4%" },
    { label: "Status", width: "6%" },
    { label: "Year", width: "4%" },
    { label: "Week", width: "4%" },
    { label: "Comments", width: "12%" },
    { label: "Acción", width: "4%" }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '100vw' }}>
      <h1 style={{ color: COLORS.primary }}>Admin VSales</h1>
      <div className='text-black' style={toolBarStyle}>
        <input 
          type="text" 
          placeholder="Buscar..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputSearchStyle}
        />
        <input type="file" accept=".csv" onChange={handleCSVUpload} disabled={loading} />
      </div>

      {/* Eliminada la restricción de min-w-[1800px] y forzado el table-fixed */}
      <div className='text-black' style={tableWrapperStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead style={{ background: COLORS.primary, color: 'white' }}>
            <tr>
              {headers.map(h => (
                <th key={h.label} style={{ ...thStyle, width: h.width }}>{h.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} style={trStyle}>
                <td style={tdStyle}>{item.sector}</td>
                <td style={tdStyle}>{item.type}</td>
                <td style={{ ...tdStyle, fontWeight: 'bold' }}>{item.name}</td>
                <td style={tdStyle}>{item.dwt?.toLocaleString()}</td>
                <td style={tdStyle}>{item.year_b}</td>
                <td style={tdStyle}>{item.yard}</td>
                <td style={tdStyle}>{item.country}</td>
                <td style={tdStyle}>{item.buyer}</td>
                <td style={{ ...tdStyle, color: COLORS.success, fontWeight: 'bold' }}>{item.price}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{item.scrubber ? "✅" : "❌"}</td>
                <td style={tdStyle}>{item.status}</td>
                <td style={tdStyle}>{item.year_r}</td>
                <td style={tdStyle}>{item.week}</td>
                <td style={{ ...tdStyle, fontSize: '11px', color: '#666' }}>
                  {item.comments}
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <button onClick={() => handleDelete(item.id)} style={deleteBtnStyle}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && <button onClick={() => loadData(false)} style={loadMoreBtnStyle}>Ver más</button>}
    </div>
  );
}

const toolBarStyle = { display: 'flex', gap: '20px', marginBottom: '20px', background: '#f8f9fa', padding: '15px', borderRadius: '8px' };
const inputSearchStyle = { padding: '8px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' };
// Eliminado el desbordamiento horizontal forzado
const tableWrapperStyle = { background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' };
// Eliminado whiteSpace: 'nowrap' y añadidas propiedades de ruptura de texto fluida
const thStyle = { padding: '12px 8px', textAlign: 'left', fontSize: '11px', fontWeight: 'bold' };
const tdStyle = { padding: '10px 8px', fontSize: '11px', borderBottom: '1px solid #f0f0f0', wordBreak: 'break-word', overflowWrap: 'anywhere' };
const trStyle = { transition: 'background 0.2s' };
const deleteBtnStyle = { background: '#e74c3c', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };
const loadMoreBtnStyle = { display: 'block', margin: '30px auto', padding: '12px 25px', background: COLORS.primary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };