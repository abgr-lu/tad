"use client";
import { useEffect, useState } from 'react';

export default function VSalesDashboard() {
  const [data, setData] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null); // 'tanker' o 'db'
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch('/api/admin/read?table=vsales')
      .then(res => res.json())
      .then(json => setData(Array.isArray(json) ? json : []));
  }, []);

  // Filtrado por sector seleccionado y por término de búsqueda (nombre o tipo)
  const filteredData = data.filter(item => {
    const matchesSector = item.sector?.toLowerCase() === selectedSector?.toLowerCase();
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSector && matchesSearch;
  });

  // Pantalla de selección inicial
  if (!selectedSector) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>🚢 Selecciona un Sector</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
          <SectorCard title="TANKERS" onClick={() => setSelectedSector('tanker')} icon="🛢️" />
          <SectorCard title="DRY BULK (DB)" onClick={() => setSelectedSector('db')} icon="🏗️" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button onClick={() => setSelectedSector(null)} style={backBtnStyle}>⬅️ Cambiar Sector</button>
          <h1 style={{ marginTop: '10px' }}>Listado de Ventas: {selectedSector.toUpperCase()}</h1>
        </div>
        
        {/* Filtro superior */}
        <input 
          type="text" 
          placeholder="Filtrar por nombre o tipo..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchStyle}
        />
      </header>

      <div style={tableContainerStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Tipo</th>
              <th style={thStyle}>DWT</th>
              <th style={thStyle}>Año B.</th>
              <th style={thStyle}>Astillero</th>
              <th style={thStyle}>País</th>
              <th style={thStyle}>Comprador</th>
              <th style={thStyle}>Precio (M$)</th>
              <th style={thStyle}>Scrubber</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Año R.</th>
              <th style={thStyle}>Semana</th>
              <th style={thStyle}>Comentarios</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee', background: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={tdStyle}>{item.id}</td>
                <td style={{ ...tdStyle, fontWeight: 'bold' }}>{item.name}</td>
                <td style={tdStyle}>{item.type}</td>
                <td style={tdStyle}>{item.dwt?.toLocaleString()}</td>
                <td style={tdStyle}>{item.year_b}</td>
                <td style={tdStyle}>{item.yard || '-'}</td>
                <td style={tdStyle}>{item.country || '-'}</td>
                <td style={tdStyle}>{item.buyer || '-'}</td>
                <td style={{ ...tdStyle, fontWeight: 'bold', color: '#188038' }}>{item.price || '-'}</td>
                <td style={tdStyle}>{item.scrubber ? '✅' : '❌'}</td>
                <td style={tdStyle}>{item.status || '-'}</td>
                <td style={tdStyle}>{item.year_r}</td>
                <td style={tdStyle}>{item.week}</td>
                <td style={{ ...tdStyle, fontSize: '11px', color: '#666', maxWidth: '200px' }}>{item.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Componentes y Estilos auxiliares ---

function SectorCard({ title, onClick, icon }) {
  return (
    <div onClick={onClick} style={cardStyle}>
      <span style={{ fontSize: '40px' }}>{icon}</span>
      <h3 style={{ marginTop: '10px' }}>{title}</h3>
    </div>
  );
}

const cardStyle = {
  width: '250px', padding: '40px', borderRadius: '15px', background: 'white',
  border: '1px solid #ddd', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  transition: 'all 0.2s'
};

const searchStyle = {
  padding: '10px 15px', width: '300px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px'
};

const tableContainerStyle = {
  background: 'white', borderRadius: '12px', border: '1px solid #ddd', overflowX: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
};

const backBtnStyle = {
  background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'
};

const thStyle = { padding: '12px', textAlign: 'left', color: '#5f6368', whiteSpace: 'nowrap' };
const tdStyle = { padding: '12px', color: '#3c4043' };
