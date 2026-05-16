"use client";
import { useEffect, useState, useCallback } from "react";
import { COLORS } from "@/lib/ui-constants";

export default function OrderbookDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSector, setActiveSector] = useState("Tankers");

  const sectors = ["Tankers", "DB"];

  // 1. DATA LOAD LOGIC
  const loadOrderbook = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch data from OB table (we use a sufficient limit to get all types)
      const res = await fetch(`/api/admin/read?table=ob&limit=100`);
      const allData = await res.json();

      if (Array.isArray(allData)) {
        // Filter by active sector and sort by ID
        const filtered = allData
          .filter(item => item.sector === activeSector)
          .sort((a, b) => a.id - b.id);

        setData(filtered);
      }
    } catch (error) {
      console.error("Error loading Orderbook:", error);
    } finally {
      setLoading(false);
    }
  }, [activeSector]);

  useEffect(() => {
    loadOrderbook();
  }, [loadOrderbook]);

  return (
    <div style={{ padding: '20px', maxWidth: '100vw' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ color: COLORS.primary, fontSize: '24px', marginBottom: '5px' }}>
          Newbuilding Orderbook
        </h1>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Scheduled deliveries by vessel type and year.
        </p>
      </header>

      {/* SECTOR SELECTOR (Consistency with VValues and VSales) */}
      <div style={tabsContainer}>
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => setActiveSector(sector)}
            style={{
              ...tabButton,
              backgroundColor: activeSector === sector ? COLORS.primary : "white",
              color: activeSector === sector ? "white" : "#666",
              border: `1px solid ${activeSector === sector ? COLORS.primary : "#ddd"}`,
            }}
          >
            {sector === "DB" ? "Dry Bulk" : sector}
          </button>
        ))}
      </div>

      <div style={tableWrapperStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead style={{ background: COLORS.primary, color: 'white' }}>
            <tr>
              <th style={thStyle}>Vessel Type</th>
              <th style={thStyle}>2025</th>
              <th style={thStyle}>2026</th>
              <th style={thStyle}>2027</th>
              <th style={thStyle}>2028</th>
              <th style={thStyle}>Beyond</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} style={trStyle}>
                  <td style={{ ...tdStyle, fontWeight: 'bold', color: '#333' }}>{item.type}</td>
                  <td style={tdStyle}>{item["2025"]?.toLocaleString() || '0'}</td>
                  <td style={tdStyle}>{item["2026"]?.toLocaleString() || '0'}</td>
                  <td style={tdStyle}>{item["2027"]?.toLocaleString() || '0'}</td>
                  <td style={tdStyle}>{item["2028"]?.toLocaleString() || '0'}</td>
                  <td style={tdStyle}>{item.beyond?.toLocaleString() || '0'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  {loading ? "Loading orderbook data..." : `No orderbook entries found for ${activeSector === "DB" ? "Dry Bulk" : activeSector}.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
        * Units displayed in deadweight tonnage (DWT) or number of vessels depending on report criteria.
      </footer>
    </div>
  );
}

// STYLES (Matching VValues and VSales)
const tabsContainer = { 
  display: 'flex', 
  gap: '10px', 
  marginBottom: '20px' 
};

const tabButton = {
  padding: '10px 25px',
  borderRadius: '25px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  transition: '0.2s ease'
};

const tableWrapperStyle = { 
  overflowX: 'auto', 
  background: 'white', 
  borderRadius: '10px', 
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  border: '1px solid #eee' 
};

const thStyle = { 
  padding: '15px 12px', 
  textAlign: 'left', 
  fontSize: '12px', 
  textTransform: 'uppercase', 
  whiteSpace: 'nowrap'
};

const tdStyle = { 
  padding: '14px 12px', 
  fontSize: '13px', 
  color: '#555',
  borderBottom: '1px solid #f9f9f9'
};

const trStyle = {
  transition: 'background 0.2s',
};