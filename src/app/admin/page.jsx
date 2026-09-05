// app/admin/page.jsx
import Link from 'next/link';

export default function AdminPage() {
  const managementLinks = [
    { href: "/admin/users", label: "Gestionar Usuarios", desc: "Control de cuentas y privilegios corporativos" },
    { href: "/admin/companies", label: "Gestionar Companies", desc: "Directorio de compañías marítimas e informes" },
    { href: "/admin/vvalues", label: "Gestionar V-Values", desc: "Matrices algorítmicas de valoración de activos" },
    { href: "/admin/vsales", label: "Gestionar V-Sales", desc: "Registros de ventas y fletes de buques" },
    { href: "/admin/ob", label: "Gestionar Order Book", desc: "Cartera de pedidos y construcción naval" },
    { href: "/admin/shorts", label: "Gestionar Shorts", desc: "Posiciones cortas y métricas de mercado" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* CABECERA */}
      <header className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-[900] tracking-tighter text-white uppercase italic">
          Panel de Control de Super Admin
        </h1>
        <p className="mt-2 text-xs font-bold text-slate-400 tracking-wide">
          Selecciona una sección en el menú lateral o accede rápidamente a través de las tarjetas operativas para gestionar los datos de Ourios.
        </p>
      </header>

      {/* GRID DE ACCESOS RÁPIDOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {managementLinks.map((link) => (
          <Link 
            key={link.href}
            href={link.href}
            className="bg-[#0F172A] border border-slate-800 hover:border-blue-500/40 p-6 rounded-xl transition-all group shadow-sm flex flex-col justify-between"
          >
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider group-hover:text-blue-400 transition-colors">
                {link.label}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-2 leading-relaxed">
                {link.desc}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-blue-500 uppercase tracking-widest">
              <span>Acceder al módulo</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
