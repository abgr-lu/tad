"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardHome() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetch('/api/admin/read?table=companies')
      .then(res => res.json())
      .then(data => setCompanies(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>🚢 Directorio de Compañías</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>Selecciona una compañía para ver su análisis detallado y métricas financieras.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {companies.map(company => (
          <Link 
            key={company.id} 
            href={`/dashboard/companies/${company.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{
              border: '1px solid #eee',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              background: 'white',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {company.logo_url && (
                <img src={company.logo_url} alt={company.name} style={{ height: '40px', marginBottom: '15px' }} />
              )}
              <h3 style={{ margin: '0 0 5px 0' }}>{company.name}</h3>
              <span style={{ color: '#0070f3', fontWeight: 'bold' }}>{company.ticket_1}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
