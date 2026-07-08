import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/app/components/LogoutButton'; 

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

  const menuItems = [
    { href: '/admin/users', label: 'Usuarios', icon: '👥' },
    { href: '/admin/companies', label: 'Compañías', icon: '🏢' },
    { href: '/admin/vvalues', label: 'V-Values', icon: '📈' },
    { href: '/admin/vsales', label: 'V-Sales', icon: '🚢' },
    { href: '/admin/ob', label: 'Order Book', icon: '📋' },
    { href: '/admin/shorts', label: 'Shorts', icon: '📉' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-blue-500/30">
      
      <nav className="w-64 bg-slate-900 border-r border-slate-800/80 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="border-b border-slate-800/80 pb-6 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛠️</span>
              <h2 className="text-lg font-[900] tracking-tighter uppercase italic text-white">
                Aegis <span className="text-blue-500 font-medium not-italic text-xs tracking-widest ml-1 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">ROOT</span>
              </h2>
            </div>
            <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-2">
              System Administration
            </p>
          </div>
          
          <ul className="space-y-1.5">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className="flex items-center gap-3 text-slate-400 font-bold text-sm px-4 py-3 rounded-xl transition-all hover:bg-slate-800/50 hover:text-white group border border-transparent hover:border-slate-800"
                >
                  <span className="text-base group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <span className="tracking-tight">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-slate-800/80 pt-6 mt-6">
          <div className="bg-slate-950/40 p-1.5 rounded-2xl border border-slate-800/40 hover:border-red-500/20 transition-all group">
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 p-10 bg-slate-950 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}