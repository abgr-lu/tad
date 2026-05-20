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

    // 2. Cargar últimas ventas (dinámico)
    fetch('/api/admin/read?table=vsales')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecentSales(data.slice(0, 3)); // Tomamos solo las 3 más recientes
        }
      });
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      
      {/* HEADER DE BIENVENIDA PREMIUM (Estilo Tarjeta de Élite, sin imagen) */}
      <header className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 rounded-2xl p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 text-7xl opacity-10 pointer-events-none select-none font-black italic uppercase tracking-tighter">
          AEGIS
        </div>
        <h1 className="text-3xl md:text-4xl font-[900] tracking-tighter text-white uppercase italic">
          ¡Bienvenido de nuevo, <span className="text-blue-500 not-italic">{user?.name || 'Usuario'}</span>! 👋
        </h1>
        <p className="mt-3 text-sm text-slate-400 font-bold tracking-tight max-w-2xl leading-relaxed">
          Este es tu resumen general en la terminal Aegis Analytics. Explora los conjuntos de datos, los cambios algorítmicos de valoración y las últimas novedades del mercado marítimo global.
        </p>
      </header>

      {/* SECCIÓN: ACCESOS RÁPIDOS */}
      <div>
        <h3 className="text-xs font-black tracking-[0.2em] text-slate-500 uppercase mb-4">
          🚀 Módulos del Sistema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickLink href="/dashboard/companies" title="Compañías" desc="Directorio e historial de empresas." icon="🏢" borderClass="border-t-blue-500" />
          <QuickLink href="/dashboard/vvalues" title="V-Values" desc="Modelos dinámicos de valoración." icon="📊" borderClass="border-t-emerald-500" />
          <QuickLink href="/dashboard/vsales" title="V-Sales" desc="Transacciones y ventas del mercado." icon="🚢" borderClass="border-t-amber-500" />
        </div>
      </div>

      {/* SECCIÓN: ÚLTIMAS VENTAS (ESTILO FEED FINANCIERO BLOOMBERG) */}
      <div>
        <h3 className="text-xs font-black tracking-[0.2em] text-slate-500 uppercase mb-4">
          ⚓ Últimas Ventas del Mercado
        </h3>
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl overflow-hidden backdrop-blur-md">
          {recentSales.length > 0 ? (
            <div className="divide-y divide-slate-800/60">
              {recentSales.map((sale) => (
                <div 
                  key={sale.id} 
                  className="p-4 px-6 flex justify-between items-center hover:bg-slate-900/60 transition-colors duration-150 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-bold group-hover:text-blue-400 transition-colors">➔</span>
                    <div>
                      <span className="font-black text-sm text-white tracking-tight">{sale.name}</span>
                      <span className="text-[11px] text-slate-500 font-bold tracking-wider uppercase ml-2">
                        {sale.type}
                      </span>
                    </div>
                  </div>
                  <div className="font-mono text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/10">
                    ${sale.price}M
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <span className="inline-block animate-spin rounded-full h-4 w-4 border border-slate-500 border-t-transparent mr-2 align-middle" />
              <span className="text-xs text-slate-500 font-mono tracking-wider uppercase">
                Sincronizando últimas transacciones de la flota...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER / PANEL DE ESTADO */}
      <footer className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs">
        <div className="flex items-center gap-2.5 font-bold text-slate-400 tracking-tight">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Estado de la cuenta:</span>
          <span className="text-white font-black bg-slate-800/60 px-2 py-0.5 rounded border border-slate-800/40">
            {user?.super ? 'Administrador' : 'Suscripción Premium'} ✅
          </span>
        </div>
        <Link 
          href="/dashboard/profile" 
          className="text-blue-400 font-black tracking-wider uppercase text-[11px] hover:text-white transition-colors flex items-center gap-1 group"
        >
          Gestionar Perfil <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </footer>

    </div>
  );
}

// Sub-componente optimizado para las tarjetas de acceso rápido
function QuickLink({ href, title, desc, icon, borderClass }) {
  return (
    <Link href={href} className="group block h-full">
      <div className={`bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 p-6 rounded-2xl transition-all duration-200 h-full flex flex-col justify-between border-t-4 ${borderClass}`}>
        <div>
          <div className="text-2xl mb-3 p-2 bg-slate-950/60 w-fit rounded-xl border border-slate-800/60 group-hover:bg-slate-950 transition-colors">
            {icon}
          </div>
          <h4 className="text-white font-black text-base tracking-tight group-hover:text-blue-400 transition-colors">
            {title}
          </h4>
          <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
    </Link>
  );
}