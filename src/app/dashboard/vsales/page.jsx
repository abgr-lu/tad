"use client";
import { useEffect, useState } from 'react';
import { STYLES, COLORS } from '@/lib/ui-constants';
import SectorSelector from '@/app/components/SectorSelector';
import DataTable from '@/app/components/DataTable';

export default function VSalesDashboard() {
  const [data, setData] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/read?table=vsales')
      .then(res => res.json())
      .then(json => {
        setData(Array.isArray(json) ? json : []);
        setLoading(false);
      });
  }, []);

  const filteredData = data.filter(item => {
    const matchesSector = item.sector?.toLowerCase() === selectedSector?.toLowerCase();
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSector && matchesSearch;
  });

  if (!selectedSector) {
    return (
      <SectorSelector 
        title="🚢 Vessel Sales" 
        subtitle="Select a sector to view recent transactions"
        onSelect={(sector) => setSelectedSector(sector)} 
      />
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setSelectedSector(null)} style={STYLES.backBtn}>⬅️ Change Sector</button>
        <input 
          type="text" 
          placeholder="Filter by name or type..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchStyle}
        />
      </header>

      <DataTable 
        columns={["Year R.", "Week", "Name", "Type", "DWT", "Year B.", "Price (M$)", "Scrubber", "Status"]}
        data={filteredData}
        loading={loading}
        renderRow={(item, index) => (
          <tr key={item.id} style={{ 
            borderBottom: `1px solid ${COLORS.border}`, 
            background: index % 2 === 0 ? COLORS.white : '#fafafa' 
          }}>
            <td style={STYLES.td}>{item.year_r}</td>
            <td style={STYLES.td}>{item.week}</td>
            <td style={{ ...STYLES.td, fontWeight: 'bold' }}>{item.name}</td>
            <td style={STYLES.td}>{item.type}</td>
            <td style={STYLES.td}>{item.dwt?.toLocaleString()}</td>
            <td style={STYLES.td}>{item.year_b}</td>
            <td style={{ ...STYLES.td, fontWeight: 'bold', color: COLORS.success }}>{item.price || '-'}</td>
            <td style={STYLES.td}>{item.scrubber ? '✅' : '❌'}</td>
            <td style={STYLES.td}>{item.status || '-'}</td>
          </tr>
        )}
      />
    </div>
  );
}

const searchStyle = { padding: '10px', width: '250px', borderRadius: '8px', border: `1px solid ${COLORS.border}` };