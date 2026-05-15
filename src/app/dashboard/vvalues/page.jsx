"use client";
import { useEffect, useState } from 'react';
import { STYLES, COLORS } from '@/lib/ui-constants';
import SectorSelector from '@/app/components/SectorSelector';

export default function VValuesDashboard() {
  const [data, setData] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);

  useEffect(() => {
    fetch('/api/admin/read?table=vvalues')
      .then(res => res.json())
      .then(json => setData(Array.isArray(json) ? json : []));
  }, []);

  const filteredData = data.filter(item => 
    item.sector?.toLowerCase() === selectedSector?.toLowerCase()
  );

  if (!selectedSector) {
    return (
      <SectorSelector 
        title="📈 Market V-Values" 
        subtitle="Valores históricos por sector y edad del buque"
        onSelect={(sector) => setSelectedSector(sector)} 
      />
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <button onClick={() => setSelectedSector(null)} style={STYLES.backBtn}>⬅️ Cambiar Sector</button>
        <h1 style={{ fontSize: '24px', color: '#202124' }}>Market V-Values: {selectedSector.toUpperCase()}</h1>
      </header>

      <div style={STYLES.tableContainer}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: COLORS.bgHeader, borderBottom: `2px solid ${COLORS.border}` }}>
              <th style={STYLES.th}>Type</th>
              <th style={STYLES.th}>NB</th>
              <th style={STYLES.th}>5Y</th>
              <th style={STYLES.th}>10Y</th>
              <th style={STYLES.th}>15Y</th>
              <th style={STYLES.th}>20Y</th>
              <th style={STYLES.th}>Scrap</th>
              <th style={STYLES.th}>Periodo</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id} style={{ 
                borderBottom: `1px solid ${COLORS.border}`, 
                background: index % 2 === 0 ? COLORS.white : '#fafafa' 
              }}>
                <td style={{ ...STYLES.td, fontWeight: 'bold' }}>{item.type}</td>
                <td style={STYLES.td}>${item.nb}M</td>
                <td style={STYLES.td}>${item["5"]}M</td>
                <td style={STYLES.td}>${item["10"]}M</td>
                <td style={STYLES.td}>${item["15"]}M</td>
                <td style={STYLES.td}>${item["20"]}M</td>
                <td style={STYLES.td}>${item.scrap}M</td>
                <td style={STYLES.td}>W{item.week} - {item.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}