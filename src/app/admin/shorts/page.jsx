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

  // 1. DATA LOAD (PAGINATION)
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

  // 2. CSV UPLOAD WITH DUPLICATE PROTECTION
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
        
        // Use a Map to ensure each symbol is unique within this batch
        const uniqueDataMap = new Map();

        results.data.forEach(row => {
          if (row.symbol && String(row.symbol).trim() !== "") {
            const symbol = String(row.symbol).trim().toUpperCase();
            
            // If symbol repeats in CSV, the last one seen will overwrite previous ones
            uniqueDataMap.set(symbol, {
              company: row.company || "",
              symbol: symbol,
              market: row.market || "",
              current_short: cleanNum(row.current_short),
              previous_short: cleanNum(row.previous_short),
              outstanding: cleanNum(row.outstanding),
              float: cleanNum(row.float),
              av_vol: cleanNum(row.av_vol),
              date: row.date ? String(row.date).trim() : ""
            });
          }
        });

        const formattedData = Array.from(uniqueDataMap.values());

        try {
          const res = await fetch("/api/admin/bulk-insert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ table: "shorts", data: formattedData }),
          });

          if (res.ok) { 
            alert(`Success: ${formattedData.length} unique records processed.`); 
            loadData(true); 
          } else {
            const err = await res.json();
            alert("Error: " + (err.error || "Upload failed"));
          }
        } catch (error) {
          alert("Connection error during upload");
        } finally {
          setLoading(false);
          e.target.value = "";
        }
      }
    });
  };

  // 3. DELETE RECORD
  const handleDelete = async (id) => {
    if (!confirm("Delete this record?")) return;
    const res = await fetch("/api/admin/delete", {
      method: "DELETE",
      body: JSON.stringify({ table: "shorts", id })
    });
    if (res.ok) setData(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: COLORS.primary }}>Admin: Shorts Management</h1>

      <div style={toolBarStyle}>
        <label style={labelStyle}>Import CSV File (Auto-cleans duplicates)</label>
        <input type="file" accept=".csv" onChange={handleCSVUpload} disabled={loading} />
        {loading && <span style={{ marginLeft: '10px', color: COLORS.primary }}>Processing...</span>}
      </div>

      <div style={tableWrapperStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
          <thead style={{ background: COLORS.primary, color: 'white' }}>
            <tr>
              {["Company", "Symbol", "Market", "Current", "Previous", "Outstanding", "Float", "Avg Vol", "Date", "Action"].map(h => (
                <th key={h} style={thStyle}>{h}</th>
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
                  <button onClick={() => handleDelete(item.id)} style={deleteBtnStyle}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && !loading && (
        <button onClick={() => loadData(false)} style={loadMoreStyle}>Load More</button>
      )}
    </div>
  );
}

// STYLES
const toolBarStyle = { marginBottom: '20px', padding: '15px', background: '#f4f4f4', borderRadius: '8px' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' };
const thStyle = { padding: '10px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase' };
const tdStyle = { padding: '10px', fontSize: '13px' };
const deleteBtnStyle = { background: '#e74c3c', color: 'white', border: 'none', padding: '5px 8px', cursor: 'pointer', borderRadius: '4px' };
const loadMoreStyle = { display: 'block', margin: '20px auto', padding: '10px 20px', background: COLORS.primary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const tableWrapperStyle = { overflowX: 'auto', background: 'white', borderRadius: '8px', border: '1px solid #eee' };