import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Componente para el botón de Logout (lo hacemos cliente para poder usar fetch)
import LogoutButton from '@/app/components/LogoutButton'; // Ahora lo creamos abajo

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  const res = await query(
    'SELECT u.super FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.session_token = $1',
    [token]
  );

  if (!res.rows[0]?.super) {
    redirect('/dashboard');
  }

  const navItemStyle = {
    marginBottom: '10px'
  };

  const linkStyle = {
    color: '#bdc3c7',
    textDecoration: 'none',
    fontSize: '16px',
    display: 'block',
    padding: '8px 0',
    transition: 'color 0.3s'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <nav style={{ 
        width: '240px', 
        background: '#2c3e50', 
        color: 'white', 
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{ borderBottom: '1px solid #34495e', paddingBottom: '10px', marginBottom: '20px' }}>
          🛠️ Backoffice
        </h2>
        
        <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
          <li style={navItemStyle}><a href="/admin/users" style={linkStyle}>👥 Usuarios</a></li>
          <li style={navItemStyle}><a href="/admin/companies" style={linkStyle}>🏢 Compañías</a></li>
          <li style={navItemStyle}><a href="/admin/vvalues" style={linkStyle}>📈 V-Values</a></li>
          <li style={navItemStyle}><a href="/admin/vsales" style={linkStyle}>🚢 V-Sales</a></li> {/* NUEVO */}
          <li style={navItemStyle}><a href="/admin/ob" style={linkStyle}>📋 Order Book</a></li>
          <li style={navItemStyle}><a href="/admin/shorts" style={linkStyle}>📉 Shorts</a></li>
        </ul>

        {/* Botón de Logout al final del menú */}
        <div style={{ borderTop: '1px solid #34495e', paddingTop: '20px' }}>
           <LogoutButton />
        </div>
      </nav>

      {/* Área de Contenido */}
      <main style={{ flex: 1, padding: '40px', background: '#f4f7f6', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
