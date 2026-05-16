"use client";
import { useEffect, useState, useCallback } from "react";
import { COLORS } from "@/lib/ui-constants";

export default function CompaniesDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSector, setActiveSector] = useState("Tankers");

  const sectors = ["Tankers", "DB"];

  // 1. CARGA DE DATOS
  const loadCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/read?table=companies&limit=200`);
      const allData = await res.json();

      if (Array.isArray(allData)) {
        // Filtramos por sector y ordenamos por ID ascendente
        const filtered = allData
          .filter(item => item.sector === activeSector)
          .sort((a, b) => a.id - b.id);
        setData(filtered);
      }
    } catch (error) {
      console.error("Error loading companies:", error);
    } finally {
      setLoading(false);
    }
  }, [activeSector]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  // 2. FUNCIÓN DE DESCARGA SEGURA (BLOB)
  const handleDownload = async (filename) => {
    try {
      // Usamos encodeURIComponent por seguridad con caracteres especiales
      const res = await fetch(`/api/download/${encodeURIComponent(filename)}`);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server Response:", errorText);
        alert(`Error ${res.status}: ${errorText || 'File not found'}`);
        return;
      }

      // Convertimos la respuesta en un objeto binario (Blob)
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Creamos un enlace temporal y simulamos el click
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; 
      document.body.appendChild(a);
      a.click();
      
      // Limpiamos la memoria
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error("Download function error:", error);
      alert("Connection error during download.");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '100vw' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ color: COLORS.primary, fontSize: '24px', marginBottom: '5px' }}>
          Public Maritime Companies
        </h1>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Market coverage and strategic equity reports.
        </p>
      </header>

      {/* SELECTOR DE SECTOR */}
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

      {/* TABLA DE COMPAÑÍAS */}
      <div style={tableWrapperStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead style={{ background: COLORS.primary, color: 'white' }}>
            <tr>
              <th style={thStyle}>Company Name</th>
              <th style={thStyle}>Ticker / Symbol</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Equity Report</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((company) => (
                <tr key={company.id} style={trStyle}>
                  <td style={{ ...tdStyle, fontWeight: 'bold', color: '#333' }}>
                    {company.name}
                  </td>
                  <td style={{ ...tdStyle, color: COLORS.primary, fontWeight: 'bold' }}>
                    {company.ticket_1 || '-'}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    {company.excel_path ? (
                      <button 
                        onClick={() => handleDownload(company.excel_path)}
                        style={downloadBtnActive}
                      >
                        Download Excel
                      </button>
                    ) : (
                      <span style={comingSoonBadge}>
                        Coming Soon
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
                  {loading ? "Loading directory..." : `No records found for ${activeSector === "DB" ? "Dry Bulk" : activeSector}.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
        * Reports are available for active subscribers. Sorted by Database ID.
      </footer>
    </div>
  );
}

// --- ESTILOS ---
const tabsContainer = { display: 'flex', gap: '10px', marginBottom: '20px' };
const tabButton = { 
  padding: '10px 25px', 
  borderRadius: '25px', 
  cursor: 'pointer', 
  fontSize: '14px', 
  fontWeight: 'bold', 
  transition: 'all 0.2s ease' 
};

const tableWrapperStyle = { 
  overflowX: 'auto', 
  background: 'white', 
  borderRadius: '10px', 
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  border: '1px solid #eee' 
};

const thStyle = { 
  padding: '18px 20px', 
  textAlign: 'left', 
  fontSize: '12px', 
  textTransform: 'uppercase', 
  letterSpacing: '1px' 
};

const tdStyle = { 
  padding: '16px 20px', 
  fontSize: '14px', 
  color: '#555',
  borderBottom: '1px solid #f2f2f2'
};

const trStyle = { transition: 'background 0.2s' };

const comingSoonBadge = {
  padding: '6px 12px',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  backgroundColor: '#f5f5f5',
  color: '#999',
  border: '1px solid #ddd',
  display: 'inline-block'
};

const downloadBtnActive = {
  padding: '8px 16px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 'bold',
  backgroundColor: COLORS.primary,
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  transition: '0.2s',
  display: 'inline-block'
};