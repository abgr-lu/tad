"use client";
import { useEffect, useState, useCallback } from "react";
import Papa from "papaparse";
import { COLORS } from "@/lib/ui-constants";

export default function AdminVValuesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 50;

  // 1. CARGA DE DATOS (PAGINACIÓN)
  const loadData = useCallback(async (isInitial = false) => {
    const currentOffset = isInitial ? 0 : offset;
    const url = `/api/admin/read?table=vv&limit=${LIMIT}&offset=${currentOffset}`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (Array.isArray(json)) {
        if (isInitial) { setData(json); setOffset(LIMIT); }
        else { setData(prev => [...prev, ...json]); setOffset(currentOffset + LIMIT); }
        setHasMore(json.length === LIMIT);
      }
    } catch (e) { console.error("Error cargando VV:", e); }
  }, [offset]);

  useEffect(() => { loadData(true); }, []);

  // 2. PROCESAMIENTO CSV
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (h) => h.trim().toLowerCase(),
      complete: async (results) => {
        const cleanNum = (v) => v ? parseFloat(String(v).replace(/[^0-9.-]/g, '')) || 0 : 0;
        
        const formattedData = results.data
          .filter(r => r.type && r.year)
          .map(r => ({
            sector: r.sector || "",
            type: String(r.type).trim(),
            nb: cleanNum(r.nb),
            "5": cleanNum(r["5"]),
            "10": cleanNum(r["10"]),
            "15": cleanNum(r["15"]),
            "20": cleanNum(r["20"]),
            scrap: cleanNum(r.scrap),
            year: parseInt(r.year),
            week: parseInt(r.week)
          }));

        const res = await fetch("/api/admin/bulk-insert", {
          method: "POST",
          body: JSON.stringify({ table: "vv", data: formattedData }),
        });

        if (res.ok) { alert("Sincronización de VValues exitosa"); loadData(true); }
        else { alert("Error en la carga"); }
        setLoading(false);
        e.target.value = "";
      }
    });
  };

  // 3. ELIMINAR REGISTRO
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este registro de valor?")) return;
    const res = await fetch("/api/admin/delete", {
      method: "DELETE",
      body: JSON.stringify({ table: "vv", id })
    });
    if (res.ok) setData(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className='text-black' style={{ padding: '20px' }}>
      <h1 style={{ color: COLORS.primary }}>Admin: VValues</h1>

      <div style={toolBarStyle}>
        <label style={labelStyle}>Cargar Reporte Semanal (CSV)</label>
        <input type="file" accept=".csv" onChange={handleCSVUpload} disabled={loading} />
        {loading && <span style={{ marginLeft: '10px' }}>Procesando...</span>}
      </div>

      <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
          <thead style={{ background: COLORS.primary, color: 'white' }}>
            <tr>
              {["Sector", "Type", "NB", "5y", "10y", "15y", "20y", "Scrap", "Year", "Week", "Action"].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>{item.sector}</td>
                <td style={{ ...tdStyle, fontWeight: 'bold' }}>{item.type}</td>
                <td style={tdStyle}>{item.nb}</td>
                <td style={tdStyle}>{item["5"]}</td>
                <td style={tdStyle}>{item["10"]}</td>
                <td style={tdStyle}>{item["15"]}</td>
                <td style={tdStyle}>{item["20"]}</td>
                <td style={tdStyle}>{item.scrap}</td>
                <td style={tdStyle}>{item.year}</td>
                <td style={tdStyle}>{item.week}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleDelete(item.id)} style={deleteBtnStyle}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && !loading && (
        <button onClick={() => loadData(false)} style={loadMoreBtn}>
          Cargar más semanas
        </button>
      )}
    </div>
  );
}

// Estilos consistentes con Shorts
const toolBarStyle = { marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: '#666' };
const thStyle = { padding: '12px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase' };
const tdStyle = { padding: '12px', fontSize: '13px' };
const deleteBtnStyle = { background: '#e74c3c', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' };
const loadMoreBtn = { display: 'block', margin: '20px auto', padding: '10px 20px', background: COLORS.primary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };