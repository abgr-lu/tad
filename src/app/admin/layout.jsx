import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/app/components/LogoutButton'; 

// Iconos SVG profesionales integrados para el panel de administración
const Icons = {
  Root: () => <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.25 2.25 0 0021 17.25l-5.83-5.83a7.5 7.5 0 10-3.75 3.75zM12 10.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
  Companies: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>,
  VValues: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
  VSales: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  OrderBook: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
  Shorts: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.306a1.195 1.195 0 011.603-.096l4.441-3.468M3.75 3.75h16.5v16.5" /></svg>
};

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
    { href: '/admin/users', label: 'Usuarios', icon: <Icons.Users /> },
    { href: '/admin/companies', label: 'Compañías', icon: <Icons.Companies /> },
    { href: '/admin/vvalues', label: 'V-Values', icon: <Icons.VValues /> },
    { href: '/admin/vsales', label: 'V-Sales', icon: <Icons.VSales /> },
    { href: '/admin/ob', label: 'Order Book', icon: <Icons.OrderBook /> },
    { href: '/admin/shorts', label: 'Shorts', icon: <Icons.Shorts /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-blue-500/30">
      
      <nav className="w-64 bg-[#0F172A] border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="border-b border-slate-800 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <Icons.Root />
              <h2 className="text-lg font-[900] tracking-tighter uppercase italic text-white">
                Ourios <span className="text-blue-500 font-medium not-italic text-xs tracking-widest ml-1 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">ROOT</span>
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
                  <span className="text-slate-400 group-hover:text-blue-400 transition-colors">
                    {item.icon}
                  </span>
                  <span className="tracking-tight">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-slate-800 pt-6 mt-6">
          <div className="bg-slate-950/40 p-1.5 rounded-2xl border border-slate-800 hover:border-red-500/20 transition-all group">
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