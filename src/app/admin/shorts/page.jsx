"use client";
import { useEffect, useState, useCallback } from "react";
import Papa from "papaparse";
import { COLORS } from "@/lib/ui-constants";

export default function AdminShortsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 50;

  // 1. CARGA DE DATOS
  const loadData = useCallback(async (isInitial = false) => {
    const currentOffset = isInitial ? 0 : offset;
    const url = `/api/admin/read?table=shorts&limit=${LIMIT}&offset=${currentOffset}`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (Array.isArray(json)) {
        if (isInitial) { setData(json); setOffset(LIMIT); }
        else { setData(prev => [...prev, ...json]); setOffset(currentOffset + LIMIT); }
        setHasMore(json.length === LIMIT);
      }
    } catch (e) { console.error(e); }
  }, [offset]);

  useEffect(() => { loadData(true); }, []);

  // 2. SUBIDA CSV
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
          .filter(r => r.symbol)
          .map(r => ({
            company: r.company || "",
            symbol: String(r.symbol).trim().toUpperCase(),
            market: r.market || "",
            current_short: cleanNum(r.current_short),
            previous_short: cleanNum(r.previous_short),
            outstanding: cleanNum(r.outstanding),
            float: cleanNum(r.float),
            av_vol: cleanNum(r.av_vol),
            date: r.date || ""
          }));

        const res = await fetch("/api/admin/bulk-insert", {
          method: "POST",
          body: JSON.stringify({ table: "shorts", data: formattedData }),
        });

        if (res.ok) { alert("Cargado"); loadData(true); }
        setLoading(false);
        e.target.value = "";
      }
    });
  };

  // 3. ELIMINAR
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar?")) return;
    const res = await fetch("/api/admin/delete", {
      method: "DELETE",
      body: JSON.stringify({ table: "shorts", id })
    });
    if (res.ok) setData(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: COLORS.primary }}>Admin Shorts</h1>

      <div style={{ marginBottom: '20px', padding: '15px', background: '#f4f4f4', borderRadius: '8px' }}>
        <input type="file" accept=".csv" onChange={handleCSVUpload} disabled={loading} />
        {loading && <span> Cargando...</span>}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
          <thead style={{ background: COLORS.primary, color: 'white' }}>
            <tr>
              {["Company", "Symbol", "Market", "Current", "Previous", "Outstanding", "Float", "Avg Vol", "Date", "Action"].map(h => (
                <th key={h} style={{ padding: '10px', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>{item.company}</td>
                <td style={{ ...tdStyle, fontWeight: 'bold' }}>{item.symbol}</td>
                <td style={tdStyle}>{item.market}</td>
                <td style={tdStyle}>{item.current_short?.toLocaleString()}</td>
                <td style={tdStyle}>{item.previous_short?.toLocaleString()}</td>
                <td style={tdStyle}>{item.outstanding?.toLocaleString()}</td>
                <td style={tdStyle}>{item.float?.toLocaleString()}</td>
                <td style={tdStyle}>{item.av_vol?.toLocaleString()}</td>
                <td style={tdStyle}>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleDelete(item.id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px', cursor: 'pointer' }}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && <button onClick={() => loadData(false)} style={btnMore}>Cargar más</button>}
    </div>
  );
}

const tdStyle = { padding: '10px', fontSize: '13px' };
const btnMore = { display: 'block', margin: '20px auto', padding: '10px', background: COLORS.primary, color: 'white', border: 'none', cursor: 'pointer' };