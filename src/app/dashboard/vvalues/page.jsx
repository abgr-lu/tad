"use client";
import { useEffect, useState, useCallback } from "react";

export default function VValuesDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestInfo, setLatestInfo] = useState({ year: null, week: null });
  const [activeSector, setActiveSector] = useState("Tankers");

  const sectors = ["Tankers", "DB"];

  // 1. DATA LOADING LOGIC (Preserving exact dual-fetch sequence)
  const loadValues = useCallback(async () => {
    setLoading(true);
    try {
      // Step 1: Get latest metadata
      const resMetadata = await fetch(`/api/admin/read?table=vv&limit=1`);
      const latestEntry = await resMetadata.json();

      if (latestEntry && latestEntry.length > 0) {
        const { year, week } = latestEntry[0];
        setLatestInfo({ year, week });

        // Step 2: Fetch records for the latest week
        const resData = await fetch(`/api/admin/read?table=vv&limit=200`);
        const allData = await resData.json();

        // Step 3: Filter by week, year, and the active sector
        const filtered = allData
          .filter(item => 
            item.year === year && 
            item.week === week && 
            item.sector === activeSector
          )
          .sort((a, b) => a.id - b.id); // Order by ID ascending

        setData(filtered);
      }
    } catch (error) {
      console.error("Error loading VValues:", error);
    } finally {
      setLoading(false);
    }
  }, [activeSector]);

  useEffect(() => {
    loadValues();
  }, [loadValues]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      
      {/* HEADER SECTION */}
      <header className="border-b border-slate-200 dark:border-slate-800/60 pb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-[900] tracking-tighter text-slate-900 dark:text-white uppercase italic">
            Vessel Valuations
          </h1>
        </div>
        
        {/* TIMESTAMPS / METADATA BADGE */}
        {latestInfo.year && (
          <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 w-fit shrink-0 font-mono tracking-tight shadow-sm shadow-blue-500/5">
            Week {latestInfo.week}, {latestInfo.year}
          </div>
        )}
      </header>

      {/* SECTOR TABS SELECTOR */}
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

      {/* HIGH-DENSITY TERMINAL GRID TABLE */}
      <div className="overflow-hidden bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-sm dark:shadow-2xl backdrop-blur-md transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800/60 text-[10px] font-black tracking-[0.15em] text-slate-400 dark:text-slate-500 uppercase">
                <th className="py-4 px-6">Vessel Type</th>
                <th className="py-4 px-4">New Building</th>
                <th className="py-4 px-4">5 Years</th>
                <th className="py-4 px-4">10 Years</th>
                <th className="py-4 px-4">15 Years</th>
                <th className="py-4 px-4">20 Years</th>
                <th className="py-4 px-4">Scrap Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm font-medium font-mono">
              {data.length > 0 ? (
                data.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors duration-150 text-slate-700 dark:text-slate-300"
                  >
                    {/* VESSEL TYPE (Non-mono text font for clean identity layout) */}
                    <td className="py-3.5 px-6 font-sans font-black text-slate-800 dark:text-white tracking-tight">
                      {item.type}
                    </td>
                    
                    {/* VALUATION HORIZONS */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">${item.nb}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">${item["5"]}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">${item["10"]}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">${item["15"]}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">${item["20"]}</td>
                    
                    {/* SCRAP VALUE (Highlighted subtly with a soft slate accent badge) */}
                    <td className="py-3.5 px-4 font-black text-slate-500 dark:text-slate-400">
                      ${item.scrap}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-16 text-center font-sans">
                    {loading ? (
                      <div className="flex flex-col items-center gap-2">
                        <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-slate-400 dark:border-slate-600 border-t-transparent" />
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono tracking-wider uppercase">
                          Sincronizando matrix algorithm feeds...
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono tracking-wider uppercase">
                        No data discovered for this asset segment within the current epoch.
                      </span>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER LEGEND */}
      <footer className="text-[10px] font-mono text-slate-400 dark:text-slate-600 tracking-wider uppercase flex items-center gap-2">
        <span>* In Million USD ($M)</span>
        </footer>

    </div>
  );
}