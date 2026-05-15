"use client";
import { useEffect, useState } from 'react';
import { STYLES, COLORS } from '@/lib/ui-constants';
import SectorSelector from '@/app/components/SectorSelector';
import DataTable from '@/app/components/DataTable'; // Asegúrate de que la ruta sea correcta

export default function CompaniesDashboard() {
  const [data, setData] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/read?table=companies')
      .then(res => res.json())
      .then(json => {
        setData(Array.isArray(json) ? json : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // --- SOLUCIÓN AL ERROR: Definir filteredData ---
  // Esta constante DEBE estar definida antes del return del JSX
  const filteredData = data.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    // Por ahora, como discutimos, el filtro de sector es true hasta que añadas la columna en BD
    return matchesSearch;
  });

  if (!selectedSector) {
    return (
      <SectorSelector 
        title="🏢 Company Directory" 
        subtitle="Select a sector to manage fleet analysis models"
        onSelect={(sector) => setSelectedSector(sector)} 
      />
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button onClick={() => setSelectedSector(null)} style={STYLES.backBtn}>
            ⬅️ Change Sector
          </button>
          <h1 style={{ fontSize: '24px', color: '#202124', marginTop: '10px' }}>
            {selectedSector.toUpperCase()} Companies
          </h1>
        </div>
        
        <input 
          type="text" 
          placeholder="Search by company name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchStyle}
        />
      </header>

      {/* Uso de DataTable con filteredData ya definido */}
      <DataTable 
        columns={["Company Name", "Fleet Analysis"]}
        data={filteredData}
        loading={loading}
        emptyMessage={`No companies found for "${searchTerm}"`}
        renderRow={(item, index) => (
          <tr key={item.id} style={{ 
            borderBottom: `1px solid ${COLORS.border}`, 
            background: index % 2 === 0 ? COLORS.white : '#fafafa' 
          }}>
            <td style={{ ...STYLES.td, fontWeight: 'bold' }}>{item.name}</td>
            <td style={{ ...STYLES.td, textAlign: 'right' }}>
              {item.excel_path ? (
                <a 
                  href={`/api/download/${item.excel_path}`} 
                  style={downloadLinkStyle}
                >
                  📥 Download Excel
                </a>
              ) : (
                <span style={{ color: COLORS.textSecondary, fontSize: '12px', fontStyle: 'italic' }}>
                  Coming soon
                </span>
              )}
            </td>
          </tr>
        )}
      />
    </div>
  );
}

// Estilos auxiliares
const searchStyle = {
  padding: '12px',
  width: '300px',
  borderRadius: '8px',
  border: `1px solid ${COLORS.border}`,
  outline: 'none'
};

const downloadLinkStyle = {
  display: 'inline-block',
  padding: '8px 16px',
  background: COLORS.primary,
  color: COLORS.white,
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '13px',
  fontWeight: 'bold'
};