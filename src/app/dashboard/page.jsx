"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

const ArrowIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const [latestCompanies, setLatestCompanies] = useState([]);
  const [latestVesselInfo, setLatestVesselInfo] = useState({ year: null, week: null });

  useEffect(() => {
    // 1. Obtener datos del usuario actual
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        const userData = Array.isArray(data) ? data[0] : data;
        setUser(userData);
      });

    // 2. Obtener los últimos 10 registros de la tabla 'companies'
    fetch('/api/admin/read?table=companies&limit=200')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Ordenamos por ID o fecha descendente y tomamos los últimos 10
          const sorted = data.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
          setLatestCompanies(sorted.slice(0, 10));
        }
      });

    // 3. Obtener la fecha más actual (year y week) de la tabla 'vv'
    fetch('/api/admin/read?table=vv&limit=500')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Buscamos el año y semana más altos o recientes
          // Suponemos que los datos tienen propiedades 'year' y 'week' numéricas
          const maxRecord = data.reduce((latest, current) => {
            if (!latest) return current;
            if (current.year > latest.year) return current;
            if (current.year === latest.year && (current.week || 0) > (latest.week || 0)) return current;
            return latest;
          }, null);

          if (maxRecord) {
            setLatestVesselInfo({ year: maxRecord.year, week: maxRecord.week });
          }
        }
      });
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      
      {/* HEADER CORPORATIVO */}
      <header className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-10 relative overflow-hidden shadow-sm">
        <div className="absolute -top-6 -right-6 text-[120px] opacity-[0.02] dark:opacity-5 pointer-events-none select-none font-black italic tracking-tighter text-slate-900 dark:text-white leading-none">
          OURIOS
        </div>
        
        <h1 className="text-3xl font-[900] tracking-tighter text-slate-900 dark:text-white uppercase italic relative z-10">
          Overview
        </h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wide max-w-2xl leading-relaxed relative z-10">
          Welcome, <span className="font-bold text-slate-700 dark:text-slate-300">{user?.name || 'Analyst'}</span>
        </p>
      </header>

      {/* SECCIÓN: ACCESOS RÁPIDOS Y DATOS DINÁMICOS */}
      <div>
        <h3 className="text-[10px] font-bold tracking-[0.2em] text-slate-500 dark:text-slate-400 uppercase mb-4 pl-1">
          Last updates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Tarjeta de Companies con listado de los últimos 10 */}
          <QuickLinkContainer href="/dashboard/companies" title="Companies" arrow={<ArrowIcon />}>
            {latestCompanies.length > 0 ? (
              <div className="space-y-2 mt-2 max-h-60 overflow-y-auto pr-1">
                {latestCompanies.map((comp) => (
                  <div key={comp.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800/60 font-mono">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-slate-900 dark:text-white truncate">{comp.name}</span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-bold">{comp.ticket_1 || '-'}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                      {comp.created_at ? new Date(comp.created_at).toLocaleDateString() : ''}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-2 font-medium">Loading latest corporate records...</p>
            )}
          </QuickLinkContainer>

          {/* Tarjeta de Vessel Valuations con la semana y año actual */}
          <QuickLinkContainer href="/dashboard/vvalues" title="Vessel Valuations" arrow={<ArrowIcon />}>
            <div className="mt-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Latest valuation horizon recorded in database:</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-2 rounded-xl text-blue-600 dark:text-blue-400 font-mono font-bold text-xs">
                <span>Week {latestVesselInfo.week || '--'}, Year {latestVesselInfo.year || '----'}</span>
              </div>
            </div>
          </QuickLinkContainer>

        </div>
      </div>

      {/* FOOTER / PANEL DE ESTADO */}
      <footer className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs shadow-sm">
        <div className="flex items-center gap-3 font-medium text-slate-500 dark:text-slate-400">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          <span className="uppercase tracking-widest text-[10px] font-bold">Network Status: <span className="text-slate-800 dark:text-slate-200">Secure</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/profile" 
            className="text-blue-600 dark:text-blue-500 font-bold tracking-widest uppercase text-[10px] hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            Manage Account
          </Link>
        </div>
      </footer>

    </div>
  );
}

// Componente contenedor auxiliar para mantener la estética de las tarjetas de acceso rápido
function QuickLinkContainer({ href, title, children, arrow }) {
  return (
    <Link href={href} className="group block h-full">
      <div className="bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 p-6 rounded-xl transition-all duration-200 h-full flex flex-col justify-between shadow-sm hover:shadow-md">
        <div>
          <h4 className="text-slate-900 dark:text-white font-bold text-sm tracking-wide group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase">
            {title}
          </h4>
          {children}
        </div>
        <div className="mt-6 flex justify-end text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
          {arrow}
        </div>
      </div>
    </Link>
  );
}