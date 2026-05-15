"use client";
import { useEffect, useState } from 'react';
import { STYLES, COLORS } from '@/lib/ui-constants';
import SectorSelector from '@/app/components/SectorSelector';
import DataTable from '@/app/components/DataTable';

export default function OrderBookDashboard() {
  const [data, setData] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/read?table=ob')
      .then(res => res.json())
      .then(json => {
        setData(Array.isArray(json) ? json : []);
        setLoading(false);
      });
  }, []);

  const filteredData = data.filter(item => 
    item.sector?.toLowerCase() === selectedSector?.toLowerCase()
  );

  if (!selectedSector) {
    return (
      <SectorSelector 
        title="📋 Order Book Summary" 
        subtitle="Current order book and scheduled deliveries"
        onSelect={(sector) => setSelectedSector(sector)} 
      />
    );
  }

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '30px' }}>
        <button onClick={() => setSelectedSector(null)} style={STYLES.backBtn}>⬅️ Change Sector</button>
        <h1 style={{ fontSize: '24px' }}>Order Book: {selectedSector.toUpperCase()}</h1>
      </header>

      <DataTable 
        columns={["Type", "2025", "2026", "2027", "2028", "Beyond", "Total OB", "Total Units"]}
        data={filteredData}
        loading={loading}
        renderRow={(item, index) => {
          const val2025 = Number(item["2025"]) || 0;
          const totalOB = (Number(item["2026"]) || 0) + (Number(item["2027"]) || 0) + 
                          (Number(item["2028"]) || 0) + (Number(item.beyond) || 0);

          return (
            <tr key={item.id} style={{ 
              borderBottom: `1px solid ${COLORS.border}`, 
              background: index % 2 === 0 ? COLORS.white : '#fafafa' 
            }}>
              <td style={{ ...STYLES.td, fontWeight: 'bold' }}>{item.type}</td>
              <td style={STYLES.td}>{val2025}</td>
              <td style={STYLES.td}>{item["2026"]}</td>
              <td style={STYLES.td}>{item["2027"]}</td>
              <td style={STYLES.td}>{item["2028"]}</td>
              <td style={STYLES.td}>{item.beyond}</td>
              <td style={{ ...STYLES.td, fontWeight: 'bold', color: COLORS.primary }}>{totalOB}</td>
              <td style={{ ...STYLES.td, fontWeight: 'bold', background: '#f0f4f8' }}>{totalOB + val2025}</td>
            </tr>
          );
        }}
      />
    </div>
  );
}