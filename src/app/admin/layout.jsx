import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  const res = await query(
    'SELECT super FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.session_token = $1',
    [token]
  );

  if (!res.rows[0]?.super) {
    redirect('/dashboard'); // Si no es super, fuera
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{ width: '200px', background: '#1a1a1a', color: 'white', padding: '20px' }}>
        <h2>Admin</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><a href="/admin/companies" style={{color: 'white'}}>Companies</a></li>
          <li><a href="/admin/ob" style={{color: 'white'}}>OB</a></li>
          <li><a href="/admin/shorts" style={{color: 'white'}}>Shorts</a></li>
          <li><a href="/admin/vvalues" style={{color: 'white'}}>V-Values</a></li>
        </ul>
      </nav>
      <main style={{ flex: 1, padding: '40px' }}>{children}</main>
    </div>
  );
}
