"use client";
import { useEffect, useState } from 'react';
import { STYLES, COLORS } from '@/lib/ui-constants';
import DataTable from '@/app/components/DataTable';

export default function ShortsDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/read?table=shorts')
      .then(res => res.json())
      .then(json => {
        if (Array.isArray(json) && json.length > 0) {
          // Filtrar por la fecha más reciente
          const latestDate = new Date(Math.max(...json.map(item => new Date(item.date))));
          const latestStr = latestDate.toISOString().split('T')[0];
          const latestData = json.filter(item => 
            new Date(item.date).toISOString().split('T')[0] === latestStr
          );
          setData(latestData);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatDateEn = (dateStr) => {
    if (!dateStr) return "...";
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Definición de columnas para el componente
  const columns = [
    "Company", "Symbol", "Current Short", "% Change", 
    "Outstanding", "% Out.", "Float", "% Float", 
    "Avg Vol", "Days to Cover", "Date"
  ];

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '26px', color: '#202124', margin: 0 }}>📉 Short Interest Monitor</h1>
          <p style={{ color: COLORS.textSecondary, marginTop: '5px' }}>Financial analysis of short positions.</p>
        </div>
        <div style={dateBadgeStyle}>
          Latest Update: <strong>{formatDateEn(data[0]?.date)}</strong>
        </div>
      </header>

      <DataTable 
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="No market data available for the selected period."
        renderRow={(item, index) => {
          // --- Lógica de Cálculos ---
          const current = Number(item.current_short) || 0;
          const previous = Number(item.previous_short) || 0;
          const outBase = Number(item.outstanding) || 0;
          const floatBase = Number(item.float) || 0;
          const vol = Number(item.av_vol) || 0;

          const pctChange = previous !== 0 ? ((current - previous) / previous) * 100 : 0;
          const pctOut = outBase > 0 ? (current / (outBase * 1000000)) * 100 : 0;
          const pctFloat = floatBase > 0 ? (current / (floatBase * 1000000)) * 100 : 0;
          const dtc = vol > 0 ? (current / 1000000) / vol : 0;

          return (
            <tr key={item.id} style={{ 
              borderBottom: `1px solid ${COLORS.border}`, 
              background: index % 2 === 0 ? COLORS.white : '#fafafa' 
            }}>
              <td style={{ ...STYLES.td, textAlign: 'left', fontWeight: 'bold' }}>{item.company}</td>
              <td style={{ ...STYLES.td, color: COLORS.primary, fontWeight: 'bold' }}>{item.symbol}</td>
              <td style={STYLES.td}>{current.toLocaleString()}</td>
              
              <td style={{ ...STYLES.td, fontWeight: 'bold', color: pctChange > 0 ? '#d93025' : COLORS.success }}>
                {pctChange > 0 ? '+' : ''}{pctChange.toFixed(2)}%
              </td>

              <td style={STYLES.td}>{outBase.toFixed(1)}M</td>
              <td style={{ ...STYLES.td, background: '#f8f9fa' }}>{pctOut.toFixed(2)}%</td>
              
              <td style={STYLES.td}>{floatBase.toFixed(1)}M</td>
              <td style={{ ...STYLES.td, background: '#f8f9fa' }}>{pctFloat.toFixed(2)}%</td>

              <td style={STYLES.td}>{vol.toFixed(3)}M</td>
              <td style={{ ...STYLES.td, fontWeight: 'bold' }}>{dtc.toFixed(2)}</td>
              <td style={STYLES.td}>{formatDateEn(item.date)}</td>
            </tr>
          );
        }}
      />
    </div>
  );
}

const dateBadgeStyle = {
  background: '#e8f0fe',
  color: COLORS.primary,
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '14px',
  border: `1px solid ${COLORS.primary}33`,
  fontWeight: '500'
};