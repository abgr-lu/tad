"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

export default function CompaniesDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSector, setActiveSector] = useState("Tankers");

  const sectors = ["Tankers", "DB", "Master"];

  // 1. CARGA DE DATOS DESDE LA API CON SECTORES
  const loadCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/read?table=companies&limit=200`);
      const allData = await res.json();

      if (Array.isArray(allData)) {
        const filtered = allData
          .filter(item => item.sector === activeSector)
          .sort((a, b) => a.id - b.id);
        setData(filtered);
      }
    } catch (error) {
      console.error("Error loading companies:", error);
    } finally {
      setLoading(false);
    }
  }, [activeSector]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  // Función auxiliar para formatear la fecha a estilo inglés, sin segundos y sin la "T"
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // 2. DESCARGA SEGURA DE ARCHIVOS (BLOB)
  const handleDownload = async (filename) => {
    try {
      const res = await fetch(`/api/download/${encodeURIComponent(filename)}`);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server Response:", errorText);
        alert(`Error ${res.status}: ${errorText || 'File not found'}`);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; 
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error("Download function error:", error);
      alert("Connection error during download.");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in pb-12">
      
      {/* CABECERA CORPORATIVA */}
      <header className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-[900] tracking-tighter text-slate-900 dark:text-white uppercase italic">
          Companies
        </h1>
      </header>

      {/* SELECTOR DE SECTORES (TABS) */}
      <div className="flex gap-2 p-1 bg-white dark:bg-[#0F172A] w-fit rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => setActiveSector(sector)}
            className={`px-6 py-2.5 rounded-lg text-xs font-black tracking-wider uppercase transition-all duration-150 cursor-pointer ${
              activeSector === sector
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {sector === "DB" ? "Dry Bulk" : sector}
          </button>
        ))}
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="overflow-hidden bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black tracking-[0.15em] text-slate-400 dark:text-slate-500 uppercase">
                <th className="py-4 px-6">Company Name</th>
                <th className="py-4 px-6">Ticker / Symbol</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">File</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm font-medium">
              {data.length > 0 ? (
                data.map((company) => (
                  <tr 
                    key={company.id} 
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150 group"
                  >
                    {/* NOMBRE DE LA EMPRESA (ENLACE AL PERFIL) */}
                    <td className="py-4 px-6">
                      <Link 
                        href={`/dashboard/companies/${company.id}`}
                        className="font-black text-slate-900 dark:text-white tracking-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors block"
                      >
                        {company.name}
                      </Link>
                    </td>
                    
                    {/* TICKER */}
                    <td className="py-4 px-6 font-mono text-xs">
                      <span className="text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md font-bold tracking-wide">
                        {company.ticket_1 || '-'}
                      </span>
                    </td>

                    {/* FECHA FORMATEADA DENTRO DEL CUADRANTE CELESTE */}
                    <td className="py-4 px-6 font-mono text-xs">
                      <span className="text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md font-bold tracking-wide inline-block">
                        {formatDate(company.created_at)}
                      </span>
                    </td>
                    
                    {/* BOTÓN DE DESCARGA O ESTADO */}
                    <td className="py-4 px-6">
                      {company.excel_path ? (
                        <button 
                          onClick={() => handleDownload(company.excel_path)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-black tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
                        >
                          Download Excel
                        </button>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800">
                          Coming Soon
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-16 text-center">
                    {loading ? (
                      <div className="flex flex-col items-center gap-2">
                        <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-slate-400 border-t-transparent" />
                        <span className="text-xs text-slate-400 font-mono tracking-wider uppercase">
                          Querying database directory...
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono tracking-wider uppercase">
                        No records found for {activeSector === "DB" ? "Dry Bulk" : activeSector}.
                      </span>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PIE DE PÁGINA */}
      <footer className="text-[10px] font-mono text-slate-400 dark:text-slate-500 tracking-wider uppercase flex items-center gap-2">
        
      </footer>

    </div>
  );
}