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

  if (!company) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 animate-pulse">
          Loading company profile data...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in pb-12">
      
      {/* BOTÓN DE RETORNO */}
      <button 
        onClick={() => router.back()} 
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer"
      >
        ← Return to Directory
      </button>
      
      {/* CABECERA CON LOGO Y TICKERS */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {company.logo_url && (
          <img src={company.logo_url} alt={`${company.name} logo`} className="h-16 object-contain rounded-lg bg-slate-50 dark:bg-slate-900/50 p-2 border border-slate-200 dark:border-slate-800" />
        )}
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-[900] tracking-tighter text-slate-900 dark:text-white uppercase italic">
            {company.name}
          </h1>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-md tracking-wide">
              {company.ticket_1}
            </span>
            {company.ticket_2 && (
              <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-md tracking-wide">
                {company.ticket_2}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* GRID DE MÉTRICAS PRINCIPALES */}
      <div>
        <h3 className="text-[10px] font-bold tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase mb-4 pl-1">
          Institutional Valuation Metrics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <Stat label="Price" value={`$${company.price}`} />
          <Stat label="M. Cap" value={`$${company.mcap}M`} />
          <Stat label="EV" value={`$${company.ev}M`} />
          <Stat label="P/NAV" value={`${company.pnav}x`} />
          <Stat label="EV/EBITDA" value={`${company.ev_ebitda}x`} />
          <Stat label="PER" value={`${company.per}x`} />
          <Stat label="FCF" value={`${company.fcf}%`} />
          <Stat label="EPS" value={`$${company.eps}`} />
          <Stat label="Dividend" value={`$${company.divi}`} />
          <Stat label="Div. Yield" value={`${company.divi_yield}%`} />
        </div>
      </div>

      {/* SECCIÓN DE FLOTA / TCE */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-sm">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">
          Fleet & Equivalent TCE <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-2">(Global Average: ${company.tce})</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mt-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            company[`vt${num}`] && (
              <div key={num} className="flex justify-between items-center py-2.5 border-b border-dashed border-slate-200 dark:border-slate-800/80 text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">{company[`vt${num}`]}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">${company[`tce${num}`]}</span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* SECCIÓN DE MANAGEMENT / CEO */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-sm">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">
          Management & Track Record
        </h3>
        <div className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-base font-bold text-slate-900 dark:text-white">{company.ceo_name}</span>
            <span className="w-fit text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-md text-xs font-black tracking-wider uppercase">
              Score: {company.ceo_scored}/100
            </span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
            {company.ceo_history}
          </p>
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2 font-mono">
            <strong className="text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Scrubber Fleet Ratio:</strong> {company.scrubber}%
          </div>
        </div>
      </div>

    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-5 rounded-xl text-center shadow-sm flex flex-col justify-between">
      <div className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-2">{label}</div>
      <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}