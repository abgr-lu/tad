"use client";
import { useEffect, useState } from 'react';

export default function OrderBookDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/admin/read?table=ob')
      .then(res => res.json())
      .then(json => setData(Array.isArray(json) ? json : []));
  }, []);

  // Agrupamos los datos por sector
  const sectors = [...new Set(data.map(item => item.sector))];

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '26px', color: '#202124' }}>📋 Order Book Summary</h1>
        <p style={{ color: '#5f6368' }}>Cartera de pedidos y entregas programadas por sector y año.</p>
      </header>

      {sectors.map(sector => (
        <div key={sector} style={{ marginBottom: '50px' }}>
          <h2 style={{ 
            fontSize: '18px', 
            color: '#1a73e8', 
            background: '#e8f0fe', 
            padding: '10px 20px', 
            borderRadius: '8px',
            display: 'inline-block',
            marginBottom: '15px'
          }}>
            Sector: {sector.toUpperCase()}
          </h2>

          <div style={tableContainerStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>2025</th>
                  <th style={thStyle}>2026</th>
                  <th style={thStyle}>2027</th>
                  <th style={thStyle}>2028</th>
                  <th style={thStyle}>Beyond</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter(item => item.sector === sector)
                  .map((item, index) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f1f1', background: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ ...tdStyle, fontWeight: 'bold', textAlign: 'left' }}>{item.type}</td>
                      <td style={tdStyle}>{item["2025"] || 0}</td>
                      <td style={tdStyle}>{item["2026"] || 0}</td>
                      <td style={tdStyle}>{item["2027"] || 0}</td>
                      <td style={tdStyle}>{item["2028"] || 0}</td>
                      <td style={tdStyle}>{item.beyond || 0}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {sectors.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>No hay datos disponibles en el Order Book.</p>
      )}
    </div>
  );
}

// Estilos
const tableContainerStyle = {
  background: 'white',
  borderRadius: '12px',
  border: '1px solid #e0e0e0',
  overflowX: 'auto',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
};

const thStyle = { padding: '12px 15px', fontSize: '12px', fontWeight: 'bold', color: '#5f6368', textTransform: 'uppercase' };
const tdStyle = { padding: '12px 15px', color: '#3c4043' };
