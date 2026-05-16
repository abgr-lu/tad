"use client";
import { useEffect, useState, useCallback } from "react";
import { COLORS } from "@/lib/ui-constants";

export default function VValuesDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestInfo, setLatestInfo] = useState({ year: null, week: null });
  const [activeSector, setActiveSector] = useState("Tankers");

  // Adjusted to match your database values exactly
  const sectors = ["Tankers", "DB"];

  const loadValues = useCallback(async () => {
    setLoading(true);
    try {
      // Step 1: Get latest metadata
      const resMetadata = await fetch(`/api/admin/read?table=vv&limit=1`);
      const latestEntry = await resMetadata.json();

      if (latestEntry && latestEntry.length > 0) {
        const { year, week } = latestEntry[0];
        setLatestInfo({ year, week });

        // Step 2: Fetch records for the latest week
        const resData = await fetch(`/api/admin/read?table=vv&limit=200`);
        const allData = await resData.json();

        // Step 3: Filter by week, year, and the active sector (Tankers or DB)
        const filtered = allData
          .filter(item => 
            item.year === year && 
            item.week === week && 
            item.sector === activeSector
          )
          .sort((a, b) => a.id - b.id); // Order by ID ascending

        setData(filtered);
      }
    } catch (error) {
      console.error("Error loading VValues:", error);
    } finally {
      setLoading(false);
    }
  }, [activeSector]);

  useEffect(() => {
    loadValues();
  }, [loadValues]);

  return (
    <div style={{ padding: '20px', maxWidth: '100vw' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ color: COLORS.primary, fontSize: '24px', marginBottom: '5px' }}>
          Current Vessel Values
        </h1>
        {latestInfo.year && (
          <p style={{ color: '#666', fontSize: '14px' }}>
            Market data for <strong>Week {latestInfo.week}, {latestInfo.year}</strong>
          </p>
        )}
      </header>

      {/* SECTOR SELECTOR */}
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
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
          <thead style={{ background: COLORS.primary, color: 'white' }}>
            <tr>
              <th style={thStyle}>Vessel Type</th>
              <th style={thStyle}>New Building</th>
              <th style={thStyle}>5 Years</th>
              <th style={thStyle}>10 Years</th>
              <th style={thStyle}>15 Years</th>
              <th style={thStyle}>20 Years</th>
              <th style={thStyle}>Scrap Value</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} style={trStyle}>
                  <td style={{ ...tdStyle, fontWeight: 'bold', color: '#333' }}>{item.type}</td>
                  <td style={tdStyle}>${item.nb}M</td>
                  <td style={tdStyle}>${item["5"]}M</td>
                  <td style={tdStyle}>${item["10"]}M</td>
                  <td style={tdStyle}>${item["15"]}M</td>
                  <td style={tdStyle}>${item["20"]}M</td>
                  <td style={tdStyle}>${item.scrap}M</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  {loading ? "Loading..." : "No data found for this sector in the current week."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
        * Values in Million USD ($M). Last updated: Week {latestInfo.week}/{latestInfo.year}.
      </footer>
    </div>
  );
}

// STYLES
const tabsContainer = { display: 'flex', gap: '10px', marginBottom: '20px' };
const tabButton = { padding: '10px 25px', borderRadius: '25px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', transition: '0.2s' };
const tableWrapperStyle = { overflowX: 'auto', background: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee' };
const thStyle = { padding: '15px 12px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase' };
const tdStyle = { padding: '14px 12px', fontSize: '13px', color: '#555', borderBottom: '1px solid #f9f9f9' };
const trStyle = { borderBottom: '1px solid #eee' };