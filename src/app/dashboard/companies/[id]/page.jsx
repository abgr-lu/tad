"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CompanyProfile() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/admin/read?table=companies`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(c => c.id.toString() === id);
        setCompany(found);
      });
  }, [id]);

  if (!company) return <p>Cargando información detallada...</p>;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: 'Segoe UI, sans-serif' }}>
      <button onClick={() => router.back()} style={{ marginBottom: '20px', border: 'none', background: 'none', cursor: 'pointer', color: '#1a73e8' }}>⬅️ Volver al listado</button>
      
      {/* Cabecera con Logo */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '30px' }}>
        {company.logo_url && <img src={company.logo_url} style={{ height: '70px', borderRadius: '8px' }} />}
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>{company.name}</h1>
          <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            <span style={{ background: '#e8f0fe', color: '#1a73e8', padding: '2px 8px', borderRadius: '4px', fontSize: '14px' }}>{company.ticket_1}</span>
            {company.ticket_2 && <span style={{ background: '#f1f3f4', padding: '2px 8px', borderRadius: '4px', fontSize: '14px' }}>{company.ticket_2}</span>}
          </div>
        </div>
      </div>

      {/* Grid de Métricas Principales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <Stat label="Precio" value={`$${company.price}`} />
        <Stat label="M. Cap" value={`$${company.mcap}M`} />
        <Stat label="EV" value={`$${company.ev}M`} />
        <Stat label="P/NAV" value={`${company.pnav}x`} />
        <Stat label="EV/EBITDA" value={`${company.ev_ebitda}x`} />
        <Stat label="PER" value={`${company.per}x`} />
        <Stat label="FCF" value={`${company.fcf}%`} />
        <Stat label="EPS" value={`$${company.eps}`} />
        <Stat label="Dividendo" value={`$${company.divi}`} />
        <Stat label="Div. Yield" value={`${company.divi_yield}%`} />
      </div>

      {/* Sección de Flota / TCE */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e0e0e0', marginBottom: '30px' }}>
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>🚢 Flota y TCE Equivalente (Global: ${company.tce})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            company[`vt${num}`] && (
              <div key={num} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #eee' }}>
                <span style={{ color: '#5f6368' }}>{company[`vt${num}`]}</span>
                <span style={{ fontWeight: 'bold' }}>${company[`tce${num}`]}</span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Sección de Management / CEO */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>👨‍💼 Management</h3>
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{company.ceo_name}</span>
            <span style={{ color: '#188038', background: '#e6f4ea', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>Score: {company.ceo_scored}/100</span>
          </div>
          <p style={{ lineHeight: '1.7', color: '#3c4043' }}>{company.ceo_history}</p>
          <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px', fontSize: '14px', color: '#5f6368' }}>
            <strong>Scrubber Flota:</strong> {company.scrubber}%
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e0e0e0', textAlign: 'center' }}>
      <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '5px', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#202124' }}>{value}</div>
    </div>
  );
}
