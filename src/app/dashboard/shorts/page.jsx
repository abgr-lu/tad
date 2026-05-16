"use client";
import { useEffect, useState, useCallback } from "react";
import { COLORS } from "@/lib/ui-constants";

export default function ShortsDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestDate, setLatestDate] = useState(null);

  // 1. DATA LOAD (FILTERED BY LATEST DATE)
  const loadLatestShorts = useCallback(async () => {
    setLoading(true);
    try {
      // Step 1: Get the latest record to identify the most recent date
      const resMetadata = await fetch(`/api/admin/read?table=shorts&limit=1`);
      const latestEntry = await resMetadata.json();

      if (latestEntry && latestEntry.length > 0) {
        const dateToFilter = latestEntry[0].date;
        setLatestDate(dateToFilter);

        // Step 2: Fetch records and filter by that date
        // We use a larger limit to ensure we get all stocks from that specific date
        const resData = await fetch(`/api/admin/read?table=shorts&limit=500`);
        const allData = await resData.json();

        const filtered = allData
          .filter(item => item.date === dateToFilter)
          .sort((a, b) => a.id - b.id); // Ordered by ID as requested

        setData(filtered);
      }
    } catch (error) {
      console.error("Error loading shorts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLatestShorts();
  }, [loadLatestShorts]);

  // --- FINANCIAL CALCULATIONS (BASED ON YOUR FORMULAS) ---

  const getPctOutstand = (curr, out) => {
    const c = parseFloat(curr || 0);
    const o = parseFloat(out || 0);
    if (!c || !o) return "0.00";
    return ((c / (o * 1000000)) * 100).toFixed(2);
  };

  const getPctFloat = (curr, float) => {
    const c = parseFloat(curr || 0);
    const f = parseFloat(float || 0);
    if (!c || !f) return "0.00";
    return ((c / (f * 1000000)) * 100).toFixed(2);
  };

  const getDaysToCover = (curr, vol) => {
    const c = parseFloat(curr || 0);
    const v = parseFloat(vol || 0);
    if (!c || !v) return "0.00";
    return ((c / 1000000) / v).toFixed(2);
  };

  const getPctChange = (curr, prev) => {
    const c = parseFloat(curr || 0);
    const p = parseFloat(prev || 0);
    if (!p) return "0.00";
    return (((c - p) / p) * 100).toFixed(2);
  };

  const formatEnglish = (val) => new Intl.NumberFormat('en-US').format(val);

  return (
    <div style={{ padding: '20px', maxWidth: '100vw' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ color: COLORS.primary, fontSize: '24px', marginBottom: '5px' }}>Short Interest Analysis</h1>
        {latestDate && (
          <p style={{ color: '#666', fontSize: '14px' }}>
            Latest market data from: <strong>{new Date(latestDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
          </p>
        )}
      </header>

      <div style={tableWrapperStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1600px' }}>
          <thead style={{ background: COLORS.primary, color: 'white' }}>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Symbol</th>
              <th style={thStyle}>Market</th>
              <th style={thStyle}>Current Short</th>
              <th style={thStyle}>% Change</th>
              <th style={thStyle}>Outstanding</th>
              <th style={thStyle}>% Outstand.</th>
              <th style={thStyle}>Float</th>
              <th style={thStyle}>% Float</th>
              <th style={thStyle}>Av. Vol (3m)</th>
              <th style={thStyle}>Days to cover</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => {
                const pctChange = getPctChange(item.current_short, item.previous_short);
                const pctOut = getPctOutstand(item.current_short, item.outstanding);
                const pctFloat = getPctFloat(item.current_short, item.float);
                const dtc = getDaysToCover(item.current_short, item.av_vol);

                return (
                  <tr key={item.id} style={trStyle}>
                    <td style={tdStyle}>{item.company}</td>
                    <td style={{ ...tdStyle, fontWeight: 'bold', color: COLORS.primary }}>{item.symbol}</td>
                    <td style={tdStyle}>{item.market}</td>
                    <td style={tdStyle}>{formatEnglish(item.current_short)}</td>
                    <td style={{ ...tdStyle, fontWeight: 'bold', color: pctChange > 0 ? '#e74c3c' : pctChange < 0 ? '#27ae60' : '#555' }}>
                      {pctChange}%
                    </td>
                    <td style={tdStyle}>{parseFloat(item.outstanding || 0).toFixed(1)}</td>
                    <td style={{ ...tdStyle, fontWeight: 'bold' }}>{pctOut}%</td>
                    <td style={tdStyle}>{parseFloat(item.float || 0).toFixed(1)}</td>
                    <td style={{ ...tdStyle, fontWeight: 'bold' }}>{pctFloat}%</td>
                    <td style={tdStyle}>{parseFloat(item.av_vol || 0).toFixed(3)}</td>
                    <td style={{ ...tdStyle, fontWeight: 'bold' }}>{dtc}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="11" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  {loading ? "Loading latest reports..." : "No records found for the current period."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
        * Only displaying the most recent report. All calculations based on provided market formulas.
      </footer>
    </div>
  );
}

// STYLES
const tableWrapperStyle = { overflowX: 'auto', background: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee' };
const thStyle = { padding: '15px 12px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', whiteSpace: 'nowrap' };
const tdStyle = { padding: '14px 12px', fontSize: '13px', color: '#555', borderBottom: '1px solid #f9f9f9', whiteSpace: 'nowrap' };
const trStyle = { transition: 'background 0.2s' };