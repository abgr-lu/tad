"use client";
import { useEffect, useState, useCallback } from "react";

export default function OrderbookDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSector, setActiveSector] = useState("Tankers");

  const sectors = ["Tankers", "DB"];

  // 1. DATA WORKFLOW LOGIC
  const loadOrderbook = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/read?table=ob&limit=100`);
      const allData = await res.json();

      if (Array.isArray(allData)) {
        const filtered = allData
          .filter(item => item.sector === activeSector)
          .sort((a, b) => a.id - b.id);

        setData(filtered);
      }
    } catch (error) {
      console.error("Error loading Orderbook:", error);
    } finally {
      setLoading(false);
    }
  }, [activeSector]);

  useEffect(() => {
    loadOrderbook();
  }, [loadOrderbook]);

  // Helper to safely format numbers
  const formatNumber = (val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0 ? num.toLocaleString() : '0';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in px-2">
      
      {/* HEADER SECTION */}
      <header className="border-b border-slate-200 dark:border-slate-800/60 pb-5">
        <h1 className="text-2xl font-[900] tracking-tighter text-slate-900 dark:text-white uppercase italic">
          Newbuilding Orderbook
        </h1>
        <p className="mt-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 tracking-tight">
          Global shipyard delivery schedules, computed fleet capacity on order, and absolute aggregates.
        </p>
      </header>

      {/* SECTOR TABS SELECTOR */}
      <div className="flex gap-2 p-1 bg-slate-200/60 dark:bg-slate-900/40 w-fit rounded-xl border border-slate-200 dark:border-slate-800/40 backdrop-blur-md">
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => setActiveSector(sector)}
            className={`px-6 py-2 rounded-lg text-xs font-black tracking-wider uppercase transition-all duration-150 cursor-pointer ${
              activeSector === sector
                ? "bg-white dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-slate-200/80 dark:border-blue-500/30 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white border border-transparent"
            }`}
          >
            {sector === "DB" ? "Dry Bulk" : sector}
          </button>
        ))}
      </div>

      {/* HIGH-DENSITY ORDERBOOK GRID (Perfect balance & symmetrical widths) */}
      <div className="overflow-hidden bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-sm dark:shadow-2xl backdrop-blur-md transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left table-fixed min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800/60 text-[9px] font-black tracking-[0.15em] text-slate-400 dark:text-slate-500 uppercase">
                {/* 100% total distribution optimized for symmetry */}
                <th className="py-4 px-5 w-[16%]">Vessel Type</th>
                <th className="py-4 px-4 w-[12%] text-center">2025</th>
                <th className="py-4 px-4 w-[12%] text-center">2026</th>
                <th className="py-4 px-4 w-[12%] text-center">2027</th>
                <th className="py-4 px-4 w-[12%] text-center">2028</th>
                <th className="py-4 px-4 w-[12%] text-center">Beyond</th>
                <th className="py-4 px-4 w-[12%] text-center text-blue-600 dark:text-blue-400 bg-blue-500/[0.02] dark:bg-blue-500/[0.05]">Total OB</th>
                <th className="py-4 px-5 w-[12%] text-right text-emerald-600 dark:text-emerald-400 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.05]">Total Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-[11px] font-medium font-mono text-slate-700 dark:text-slate-300">
              {data.length > 0 ? (
                data.map((item) => {
                  const v25 = parseFloat(item["2025"]) || 0;
                  const v26 = parseFloat(item["2026"]) || 0;
                  const v27 = parseFloat(item["2027"]) || 0;
                  const v28 = parseFloat(item["2028"]) || 0;
                  const vBeyond = parseFloat(item.beyond) || 0;

                  const totalObCalculated = v26 + v27 + v28 + vBeyond;
                  const totalUnitsCalculated = v25 + v26 + v27 + v28 + vBeyond;

                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors duration-150"
                    >
                      {/* VESSEL TYPE */}
                      <td className="py-3 px-5 font-sans font-black text-slate-800 dark:text-white text-xs tracking-tight">
                        {item.type}
                      </td>
                      
                      {/* ANNUAL HORIZONS (Centered for cleaner terminal grids) */}
                      <td className="py-3 px-4 text-center">{formatNumber(item["2025"])}</td>
                      <td className="py-3 px-4 text-center">{formatNumber(item["2026"])}</td>
                      <td className="py-3 px-4 text-center">{formatNumber(item["2027"])}</td>
                      <td className="py-3 px-4 text-center">{formatNumber(item["2028"])}</td>
                      <td className="py-3 px-4 text-center">{formatNumber(item.beyond)}</td>
                      
                      {/* TOTAL OB (Symmetrical center layout) */}
                      <td className="py-3 px-4 text-center font-black text-blue-600 dark:text-blue-400 bg-blue-500/[0.02] dark:bg-blue-500/[0.05] border-x border-slate-100 dark:border-slate-800/40">
                        {totalObCalculated.toLocaleString()}
                      </td>
                      
                      {/* TOTAL UNITS BADGE (Perfect right alignment block) */}
                      <td className="py-3 px-5 text-right font-black bg-emerald-500/[0.005] dark:bg-emerald-500/[0.02]">
                        <span className="inline-block bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/40 px-2 py-1 rounded text-slate-900 dark:text-white font-bold min-w-[55px] text-center">
                          {totalUnitsCalculated.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-16 text-center font-sans">
                    {loading ? (
                      <div className="flex flex-col items-center gap-2">
                        <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-slate-400 dark:border-slate-600 border-t-transparent" />
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono tracking-wider uppercase text-center">
                          Compiling global orderbook matrices...
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono tracking-wider uppercase">
                        No delivery projections discovered for current criteria.
                      </span>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ANALYTICAL FOOTER */}
      <footer className="text-[10px] font-mono text-slate-400 dark:text-slate-600 tracking-wider uppercase flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <span>* Total OB computed as the sum of medium/long-term horizons (2026-Beyond).</span>
        <span className="hidden sm:inline">//</span>
        <span>* Total Units calculated as the absolute cumulative sum of all registered delivery brackets.</span>
      </footer>

    </div>
  );
}