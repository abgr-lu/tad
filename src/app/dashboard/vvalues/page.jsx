"use client";
import { useEffect, useState } from 'react';

export default function VValuesDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/admin/read?table=vvalues')
      .then(res => res.json())
      .then(json => setData(Array.isArray(json) ? json : []));
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', color: '#202124' }}>📈 Market V-Values</h1>
        <p style={{ color: '#5f6368' }}>Valores históricos y actuales por sector y edad del buque.</p>
      </header>

      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
        overflow: 'hidden', 
        border: '1px solid #e0e0e0' 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
              <th style={thStyle}>Sector</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>NB</th>
              <th style={thStyle}>5Y</th>
              <th style={thStyle}>10Y</th>
              <th style={thStyle}>15Y</th>
              <th style={thStyle}>20Y</th>
              <th style={thStyle}>Scrap</th>
              <th style={thStyle}>Periodo</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} style={{ 
                borderBottom: '1px solid #f1f1f1', 
                background: index % 2 === 0 ? '#fff' : '#fafafa' 
              }}>
                <td style={tdStyle}><strong>{item.sector}</strong></td>
                <td style={tdStyle}>{item.type}</td>
                <td style={tdStyle}>${item.nb}M</td>
                <td style={tdStyle}>${item["5"]}M</td>
                <td style={tdStyle}>${item["10"]}M</td>
                <td style={tdStyle}>${item["15"]}M</td>
                <td style={tdStyle}>${item["20"]}M</td>
                <td style={tdStyle}>${item.scrap}M</td>
                <td style={tdStyle}>
                  <span style={badgeStyle}>W{item.week} - {item.year}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <p style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Cargando datos del mercado...</p>
        )}
      </div>
    </div>
  );
}

// Estilos de celda
const thStyle = { padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle = { padding: '16px', fontSize: '14px', color: '#3c4043' };
const badgeStyle = { 
  background: '#e8f0fe', 
  color: '#1a73e8', 
  padding: '4px 10px', 
  borderRadius: '6px', 
  fontSize: '12px', 
  fontWeight: '600' 
};
