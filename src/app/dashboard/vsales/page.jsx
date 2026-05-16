"use client";
import { useEffect, useState, useCallback } from "react";
import { COLORS } from "@/lib/ui-constants";

export default function VSalesDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [activeSector, setActiveSector] = useState("Tankers"); // Default sector

  const sectors = ["Tankers", "DB"];
  const LIMIT = 50;

  // 1. DATA LOAD WITH SECTOR AND GLOBAL FILTER
  const loadData = useCallback(async (isNewSearch = false) => {
    setLoading(true);
    const currentOffset = isNewSearch ? 0 : offset;
    
    // We send sector and search to the API
    const url = `/api/admin/read?table=vsales&limit=${LIMIT}&offset=${currentOffset}&search=${encodeURIComponent(search)}`;
    
    try {
      const res = await fetch(url);
      const json = await res.json();
      
      if (Array.isArray(json)) {
        // Filter by the active sector in frontend
        const filteredBySector = json.filter(item => item.sector === activeSector);

        if (isNewSearch) {
          setData(filteredBySector);
          setOffset(LIMIT);
        } else {
          setData(prev => [...prev, ...filteredBySector]);
          setOffset(currentOffset + LIMIT);
        }
        // Note: hasMore might be tricky with frontend filtering, 
        // but for now we keep it based on the raw response length
        setHasMore(json.length === LIMIT);
      }
    } catch (error) {
      console.error("Error loading vsales:", error);
    } finally {
      setLoading(false);
    }
  }, [offset, search, activeSector]);

  // 2. SEARCH & SECTOR EFFECT
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, activeSector]);

  return (
    <div style={{ padding: '20px', maxWidth: '100vw' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ color: COLORS.primary, fontSize: '24px', marginBottom: '5px' }}>Vessel Sales Market</h1>
        <p style={{ color: '#666', fontSize: '14px' }}>Historical market transactions and commercial data.</p>
      </header>

      {/* SECTOR SELECTOR (Consistency with VValues) */}
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

      {/* SEARCH BAR */}
      <div style={searchBarContainer}>
        <input
          type="text"
          placeholder={`Search in ${activeSector === "DB" ? "Dry Bulk" : activeSector} by name, type, buyer...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInputStyle}
        />
        {loading && <span style={loadingTextStyle}>Updating...</span>}
      </div>

      {/* DATA TABLE */}
      <div style={tableWrapperStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1600px' }}>
          <thead style={{ background: COLORS.primary, color: 'white' }}>
            <tr>
              <th style={thStyle}>Vessel Name</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>DWT</th>
              <th style={thStyle}>Built</th>
              <th style={thStyle}>Yard</th>
              <th style={thStyle}>Country</th>
              <th style={thStyle}>Buyer</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Week / Year</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((sale) => (
                <tr key={sale.id} style={trStyle}>
                  <td style={{ ...tdStyle, fontWeight: 'bold', color: '#333' }}>{sale.name}</td>
                  <td style={tdStyle}>{sale.type}</td>
                  <td style={tdStyle}>{sale.dwt?.toLocaleString()}</td>
                  <td style={tdStyle}>{sale.year_b}</td>
                  <td style={tdStyle}>{sale.yard}</td>
                  <td style={tdStyle}>{sale.country}</td>
                  <td style={tdStyle}>{sale.buyer}</td>
                  <td style={{ ...tdStyle, fontWeight: 'bold', color: COLORS.primary }}>{sale.price || 'Undisc.'}</td>
                  <td style={tdStyle}>{sale.status}</td>
                  <td style={tdStyle}>{`W${sale.week} / ${sale.year_r}`}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  {loading ? "Loading..." : "No records found for this selection."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* LOAD MORE BUTTON */}
      {hasMore && (
        <button onClick={() => loadData(false)} disabled={loading} style={loadMoreButtonStyle}>
          {loading ? "Loading..." : "Load More Records"}
        </button>
      )}
    </div>
  );
}

// STYLES
const tabsContainer = { display: 'flex', gap: '10px', marginBottom: '20px' };
const tabButton = { padding: '10px 25px', borderRadius: '25px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', transition: '0.2s' };
const searchBarContainer = { marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' };
const searchInputStyle = { flex: 1, padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' };
const loadingTextStyle = { fontSize: '13px', color: COLORS.primary, fontWeight: '500' };
const tableWrapperStyle = { overflowX: 'auto', background: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee' };
const thStyle = { padding: '15px 12px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', whiteSpace: 'nowrap' };
const tdStyle = { padding: '14px 12px', fontSize: '13px', color: '#555', borderBottom: '1px solid #f9f9f9', whiteSpace: 'nowrap' };
const trStyle = { transition: 'background 0.2s' };
const loadMoreButtonStyle = { display: 'block', margin: '30px auto', padding: '12px 25px', background: COLORS.primary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };