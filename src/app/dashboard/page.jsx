"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const [recentSales, setRecentSales] = useState([]);

  useEffect(() => {
    // 1. Cargar datos del usuario
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        const userData = Array.isArray(data) ? data[0] : data;
        setUser(userData);
      });

    // 2. Cargar últimas ventas (opcional para dar vida al dashboard)
    fetch('/api/admin/read?table=vsales')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecentSales(data.slice(0, 3)); // Tomamos solo las 3 más recientes
        }
      });
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER DE BIENVENIDA */}
      <header style={welcomeCardStyle}>
        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>
          ¡Bienvenido de nuevo, {user?.name || 'Usuario'}! 👋
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, marginTop: '10px' }}>
          Este es tu resumen general de Shipping SaaS. Explora las métricas y novedades del mercado.
        </p>
      </header>

      {/* ACCESOS RÁPIDOS */}
      <h3 style={{ marginBottom: '20px', color: '#333' }}>🚀 Acceso Rápido</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <QuickLink href="/dashboard/companies" title="Compañías" desc="Directorio de empresas" icon="🏢" color="#1a73e8" />
        <QuickLink href="/dashboard/vvalues" title="V-Values" desc="Valores de mercado" icon="📊" color="#34a853" />
        <QuickLink href="/dashboard/vsales" title="V-Sales" desc="Ventas recientes" icon="🚢" color="#fbbc04" />
      </div>

      {/* ÚLTIMAS VENTAS (DINÁMICO) */}
      <h3 style={{ marginBottom: '20px', color: '#333' }}>⚓ Últimas Ventas del Mercado</h3>
      <div style={{ background: 'white', borderRadius: '15px', border: '1px solid #eee', overflow: 'hidden', marginBottom: '40px' }}>
        {recentSales.length > 0 ? (
          recentSales.map((sale) => (
            <div key={sale.id} style={{ padding: '15px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 'bold', color: '#1a73e8' }}>{sale.name}</span>
                <span style={{ color: '#777', fontSize: '13px', marginLeft: '10px' }}>({sale.type})</span>
              </div>
              <div style={{ fontWeight: 'bold', color: '#188038' }}>${sale.price}M</div>
            </div>
          ))
        ) : (
          <p style={{ padding: '20px', color: '#999' }}>Cargando últimas transacciones...</p>
        )}
      </div>

      {/* FOOTER / ESTADO */}
      <div style={{ background: 'white', padding: '25px', borderRadius: '15px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ color: '#666', fontSize: '14px' }}>Estado de cuenta: </span>
          <span style={{ fontWeight: 'bold' }}>{user?.super ? 'Administrador' : 'Suscripción Premium'} ✅</span>
        </div>
        <Link href="/dashboard/profile" style={{ color: '#1a73e8', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}>
          Gestionar Perfil →
        </Link>
      </div>
    </div>
  );
}

// Sub-componente para los cuadros de acceso
function QuickLink({ href, title, desc, icon, color }) {
  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ 
        background: 'white', 
        padding: '25px', 
        borderRadius: '15px', 
        border: '1px solid #eee', 
        borderTop: `5px solid ${color}`, 
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
        transition: 'all 0.2s'
      }}>
        <div style={{ fontSize: '30px', marginBottom: '10px' }}>{icon}</div>
        <h4 style={{ margin: '0 0 5px 0' }}>{title}</h4>
        <p style={{ margin: 0, fontSize: '13px', color: '#777' }}>{desc}</p>
      </div>
    </Link>
  );
}

const welcomeCardStyle = {
  background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
  color: 'white',
  padding: '50px 40px',
  borderRadius: '20px',
  marginBottom: '40px',
  boxShadow: '0 10px 20px rgba(26, 115, 232, 0.2)'
};

