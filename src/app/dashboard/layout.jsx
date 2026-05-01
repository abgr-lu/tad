import Link from 'next/link';
import LogoutButton from '@/app/components/LogoutButton'; // Reutilizamos el componente que creamos para el admin

export default function DashboardLayout({ children }) {
  const sidebarLinks = [
    { name: '🏢 Compañías', href: '/dashboard' },
    { name: '📊 V-Values', href: '/dashboard/vvalues' },
    { name: '🚢 V-Sales', href: '/dashboard/vsales' },
    { name: '📋 Order Book', href: '/dashboard/ob' },
    { name: '📉 Shorts', href: '/dashboard/shorts' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Sidebar Fijo */}
      <nav style={{ 
        width: '260px', 
        background: '#ffffff', 
        borderRight: '1px solid #e0e0e0',
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed', // Mantiene el sidebar visible mientras haces scroll
        height: '100vh'
      }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#1a73e8', fontWeight: 'bold' }}>
          🚢 Shipping SaaS
        </h2>
        
        <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
          {sidebarLinks.map(link => (
            <li key={link.href} style={{ marginBottom: '10px' }}>
              <Link href={link.href} style={{
                textDecoration: 'none',
                color: '#3c4043',
                fontSize: '15px',
                display: 'block',
                padding: '12px',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Sección de Logout */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '10px', textAlign: 'center' }}>
            Sesión de Cliente
          </p>
          <LogoutButton />
        </div>
      </nav>

      {/* Margen para compensar el sidebar fixed y contenido principal */}
      <main style={{ flex: 1, padding: '40px', marginLeft: '260px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
