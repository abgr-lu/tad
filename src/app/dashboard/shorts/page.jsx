"use client";
import { useEffect, useState } from 'react';

export default function ShortsDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/admin/read?table=shorts')
      .then(res => res.json())
      .then(json => {
        if (Array.isArray(json) && json.length > 0) {
          // 1. Encontrar la fecha más reciente (convertimos a tiempo para comparar)
          const latestDate = new Date(Math.max(...json.map(item => new Date(item.date))));
          const latestDateString = latestDate.toISOString().split('T')[0];

          // 2. Filtrar solo los registros que tengan esa fecha exacta
          const latestData = json.filter(item => {
            const itemDate = new Date(item.date).toISOString().split('T')[0];
            return itemDate === latestDateString;
          });

          setData(latestData);
        }
      });
  }, []);

  // Formatear la fecha para el título
  const displayDate = data.length > 0 
    ? new Date(data[0].date).toLocaleDateString() 
    : "...";

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <h1 style={{ fontSize: '26px', color: '#202124', margin: 0 }}>📉 Short Interest Monitor</h1>
          <p style={{ color: '#5f6368', marginTop: '5px' }}>Análisis de posiciones cortas actualizadas.</p>
        </div>
        <div style={dateBadgeStyle}>
          Última actualización: <strong>{displayDate}</strong>
        </div>
      </header>

      <div style={tableContainerStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
              <th style={thStyle}>Compañía</th>
              <th style={thStyle}>Símbolo</th>
              <th style={thStyle}>Mercado</th>
              <th style={thStyle}>Current Short</th>
              <th style={thStyle}>Previous Short</th>
              <th style={thStyle}>Outstanding (1d)</th>
              <th style={thStyle}>Float (1d)</th>
              <th style={thStyle}>Avg Vol (3d)</th>
              <th style={thStyle}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} style={{ 
                borderBottom: '1px solid #f1f1f1', 
                background: index % 2 === 0 ? '#fff' : '#fafafa' 
              }}>
                <td style={{ ...tdStyle, textAlign: 'left', fontWeight: 'bold' }}>{item.company}</td>
                <td style={{ ...tdStyle, color: '#1a73e8', fontWeight: 'bold' }}>{item.symbol}</td>
                <td style={tdStyle}>{item.market}</td>
                <td style={tdStyle}>{Number(item.current_short).toLocaleString()}</td>
                <td style={tdStyle}>{Number(item.previous_short).toLocaleString()}</td>
                <td style={tdStyle}>{Number(item.outstanding).toFixed(1)}</td>
                <td style={tdStyle}>{Number(item.float).toFixed(1)}</td>
                <td style={tdStyle}>{Number(item.av_vol).toFixed(3)}</td>
                <td style={tdStyle}>{new Date(item.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <p style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Buscando los datos más recientes...</p>
        )}
      </div>
    </div>
  );
}

// --- Estilos ---
const tableContainerStyle = {
  background: 'white',
  borderRadius: '12px',
  border: '1px solid #e0e0e0',
  overflowX: 'auto',
  boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
};

const thStyle = { padding: '15px', fontSize: '12px', fontWeight: 'bold', color: '#5f6368', textTransform: 'uppercase', whiteSpace: 'nowrap' };
const tdStyle = { padding: '15px', color: '#3c4043' };
const dateBadgeStyle = {
  background: '#fff3e0',
  color: '#e65100',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '14px',
  border: '1px solid #ffe0b2'
};
