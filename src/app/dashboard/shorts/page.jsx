"use client";
import { useEffect, useState, useCallback } from "react";

export default function ShortsDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestDate, setLatestDate] = useState(null);

  // 1. DATA LOAD (FILTERED BY LATEST DATE)
  const loadLatestShorts = useCallback(async () => {
    setLoading(true);
    try {
      const resMetadata = await fetch(`/api/admin/read?table=shorts&limit=1`);
      const latestEntry = await resMetadata.json();

      if (latestEntry && latestEntry.length > 0) {
        const dateToFilter = latestEntry[0].date;
        setLatestDate(dateToFilter);

        const resData = await fetch(`/api/admin/read?table=shorts&limit=500`);
        const allData = await resData.json();

        const filtered = allData
          .filter(item => item.date === dateToFilter)
          .sort((a, b) => a.id - b.id);

        setData(filtered);
      }
    } catch (error) {
      console.error("Error loading shorts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLatestShorts();
  }, [loadLatestShorts]);

  // --- FINANCIAL CALCULATIONS (BASED ON YOUR FORMULAS) ---

  const getPctOutstand = (curr, out) => {
    const c = parseFloat(curr || 0);
    const o = parseFloat(out || 0);
    if (!c || !o) return "0.00";
    return ((c / (o * 1000000)) * 100).toFixed(2);
  };

  const getPctFloat = (curr, float) => {
    const c = parseFloat(curr || 0);
    const f = parseFloat(float || 0);
    if (!c || !f) return "0.00";
    return ((c / (f * 1000000)) * 100).toFixed(2);
  };

  const getDaysToCover = (curr, vol) => {
    const c = parseFloat(curr || 0);
    const v = parseFloat(vol || 0);
    if (!c || !v) return "0.00";
    return ((c / 1000000) / v).toFixed(2);
  };

  const getPctChange = (curr, prev) => {
    const c = parseFloat(curr || 0);
    const p = parseFloat(prev || 0);
    if (!p) return "0.00";
    return (((c - p) / p) * 100).toFixed(2);
  };

  const formatEnglish = (val) => new Intl.NumberFormat('en-US').format(val);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in px-2">
      
      {/* HEADER SECTION */}
      <header className="border-b border-slate-200 dark:border-slate-800/60 pb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-[900] tracking-tighter text-slate-900 dark:text-white uppercase italic">
            Short Interest Analysis
          </h1>
          {latestDate && (
            <p className="mt-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 tracking-tight">
              Latest market data from: <strong className="text-slate-800 dark:text-slate-200">{new Date(latestDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
            </p>
          )}
        </div>
      </header>

      {/* CORE HIGH-DENSITY LEDGER (With strict pixel distribution for symmetry) */}
      <div className="overflow-hidden bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-sm dark:shadow-2xl backdrop-blur-md transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[1600px] table-fixed">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800/60 text-[10px] font-black tracking-[0.15em] text-slate-400 dark:text-slate-500 uppercase">
                {/* 100% total perfectly budgeted for corporate harmony */}
                <th className="py-4 px-5 w-[19%]">Name</th>
                <th className="py-4 px-3 w-[7%]">Symbol</th>
                <th className="py-4 px-3 w-[8%]">Market</th>
                <th className="py-4 px-3 w-[9%] text-center">Current Short</th>
                <th className="py-4 px-3 w-[9%] text-center">% Change</th>
                <th className="py-4 px-3 w-[9%] text-center">Outstanding</th>
                <th className="py-4 px-3 w-[9%] text-center">% Outstand.</th>
                <th className="py-4 px-3 w-[9%] text-center">Float</th>
                <th className="py-4 px-3 w-[9%] text-center">% Float</th>
                <th className="py-4 px-3 w-[10%] text-center">Av. Vol (3m)</th>
                <th className="py-4 px-5 w-[12%] text-right">Days to cover</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs font-medium font-mono text-slate-700 dark:text-slate-300">
              {data.length > 0 ? (
                data.map((item) => {
                  const pctChange = getPctChange(item.current_short, item.previous_short);
                  const pctOut = getPctOutstand(item.current_short, item.outstanding);
                  const pctFloat = getPctFloat(item.current_short, item.float);
                  const dtc = getDaysToCover(item.current_short, item.av_vol);

                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors duration-150"
                    >
                      {/* IDENTITY HORIZONS */}
                      <td className="py-3 px-5 font-sans font-black text-slate-800 dark:text-white text-sm tracking-tight truncate">{item.company}</td>
                      <td className="py-3 px-3">
                        <span className="text-blue-600 dark:text-blue-400 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 dark:border-blue-500/20 px-2 py-0.5 rounded font-bold tracking-wide">
                          {item.symbol}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-400 uppercase font-bold text-[10px] tracking-wider">{item.market}</td>
                      
                      {/* HOMOGENEOUS NUMERICAL COLUMNS (Centered to split spaces identically) */}
                      <td className="py-3 px-3 text-center text-slate-900 dark:text-slate-100 font-bold">{formatEnglish(item.current_short)}</td>
                      <td className={`py-3 px-3 text-center font-black ${
                        pctChange > 0 
                          ? 'text-red-500 dark:text-red-400' 
                          : pctChange < 0 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-slate-500'
                      }`}>
                        {pctChange}%
                      </td>
                      <td className="py-3 px-3 text-center">{parseFloat(item.outstanding || 0).toFixed(1)}M</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-slate-100">{pctOut}%</td>
                      <td className="py-3 px-3 text-center">{parseFloat(item.float || 0).toFixed(1)}M</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-slate-100">{pctFloat}%</td>
                      <td className="py-3 px-3 text-center">{parseFloat(item.av_vol || 0).toFixed(3)}M</td>
                      
                      {/* DAYS TO COVER RIGHT BLOCK BADGE */}
                      <td className="py-3 px-5 text-right font-sans font-black text-sm text-slate-800 dark:text-white">
                        <span className="inline-block bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/40 px-2.5 py-1 rounded font-mono text-xs font-bold min-w-[65px] text-center">
                          {dtc}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="11" className="py-16 text-center font-sans">
                    {loading ? (
                      <div className="flex flex-col items-center gap-2">
                        <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-slate-400 dark:border-slate-600 border-t-transparent" />
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono tracking-wider uppercase text-center">
                          Loading latest reports...
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono tracking-wider uppercase">
                        No records found for the current period.
                      </span>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-[10px] font-mono text-slate-400 dark:text-slate-600 tracking-wider uppercase flex items-center gap-2">
        <span>* Only displaying the most recent report. All calculations based on provided market formulas.</span>
      </footer>
    </div>
  );
}