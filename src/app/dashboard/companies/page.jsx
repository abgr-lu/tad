"use client";
import { useEffect, useState, useCallback } from "react";

export default function CompaniesDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSector, setActiveSector] = useState("Tankers");

  const sectors = ["Tankers", "DB"];

  // 1. DATA LOADING LOGIC (Preserving exact dependencies)
  const loadCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/read?table=companies&limit=200`);
      const allData = await res.json();

      if (Array.isArray(allData)) {
        // Filter by sector and sort by ID ascending
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

  // 2. SECURE BINARY DOWNLOAD FUNCTION (BLOB)
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
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      
      {/* HEADER SECTION */}
      <header className="border-b border-slate-200 dark:border-slate-800/60 pb-5">
        <h1 className="text-2xl font-[900] tracking-tighter text-slate-900 dark:text-white uppercase italic">
          Public Maritime Companies
        </h1>
        <p className="mt-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 tracking-tight">
          Comprehensive market coverage, institutional metrics, and strategic equity reports.
        </p>
      </header>

      {/* SECTOR TABS (High density selector) */}
      <div className="flex gap-2 p-1 bg-slate-200/60 dark:bg-slate-900/40 w-fit rounded-xl border border-slate-200 dark:border-slate-800/40 backdrop-blur-md">
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => setActiveSector(sector)}
            className={`px-6 py-2 rounded-lg text-xs font-black tracking-wider uppercase transition-all duration-150 ${
              activeSector === sector
                ? "bg-white dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-slate-200/80 dark:border-blue-500/30 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white border border-transparent"
            }`}
          >
            {sector === "DB" ? "Dry Bulk" : sector}
          </button>
        ))}
      </div>

      {/* CORE DATA TABLE (Bloomberg terminal high density design) */}
      <div className="overflow-hidden bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-sm dark:shadow-2xl backdrop-blur-md transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800/60 text-[10px] font-black tracking-[0.15em] text-slate-400 dark:text-slate-500 uppercase">
                <th className="py-4 px-6">Company Name</th>
                <th className="py-4 px-6">Ticker / Symbol</th>
                <th className="py-4 px-6 text-center">Equity Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm font-medium">
              {data.length > 0 ? (
                data.map((company) => (
                  <tr 
                    key={company.id} 
                    className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors duration-150 group"
                  >
                    {/* COMPANY NAME */}
                    <td className="py-3.5 px-6 font-black text-slate-800 dark:text-white tracking-tight">
                      {company.name}
                    </td>
                    
                    {/* TICKER BADGE */}
                    <td className="py-3.5 px-6 font-mono text-xs">
                      <span className="text-blue-600 dark:text-blue-400 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 dark:border-blue-500/20 px-2.5 py-1 rounded-md font-bold tracking-wide">
                        {company.ticket_1 || '-'}
                      </span>
                    </td>
                    
                    {/* DOWNLOAD/COMING SOON BADGE */}
                    <td className="py-3.5 px-6 text-center">
                      {company.excel_path ? (
                        <button 
                          onClick={() => handleDownload(company.excel_path)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-black tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer"
                        >
                          📥 Download Excel
                        </button>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase bg-slate-100 dark:bg-slate-950/60 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800/40">
                          Coming Soon
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-16 text-center">
                    {loading ? (
                      <div className="flex flex-col items-center gap-2">
                        <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-slate-400 dark:border-slate-600 border-t-transparent" />
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono tracking-wider uppercase">
                          Querying database directory...
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono tracking-wider uppercase">
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

      {/* FOOTER METRICS METADATA */}
      <footer className="text-[10px] font-mono text-slate-400 dark:text-slate-600 tracking-wider uppercase flex items-center gap-2">
        <span>* Analytical reports are restricted to active institutional subscribers.</span>
        <span className="hidden sm:inline">//</span>
        <span className="hidden sm:inline">Indexation: Database ID Order</span>
      </footer>

    </div>
  );
}