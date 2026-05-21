"use client";
import { useEffect, useState, useCallback, useRef } from "react";

export default function VSalesDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [activeSector, setActiveSector] = useState("Tankers");

  const offsetRef = useRef(0);
  const sectors = ["Tankers", "DB"];
  const LIMIT = 10; // Cambia a 50 en producción una vez veas que funciona impecable

  // 1. DATA LOAD LOGIC WITH STABLE MEMORY RECURSION
  const loadData = useCallback(async (isNewSearch = false, currentAccumulated = []) => {
    setLoading(true);
    
    if (isNewSearch) {
      offsetRef.current = 0;
    }

    const url = `/api/admin/read?table=vsales&limit=${LIMIT}&offset=${offsetRef.current}&search=${encodeURIComponent(search)}`;
    
    try {
      const res = await fetch(url);
      const json = await res.json();
      
      if (Array.isArray(json)) {
        // Filter rows that belong to the active visual sector tab
        const targetedSectorRows = json.filter(item => item.sector === activeSector);
        
        // Append current batch results to memory array accumulator
        const updatedAccumulated = [...currentAccumulated, ...targetedSectorRows];

        // Shift database offset chunk index forward
        offsetRef.current += LIMIT;
        setOffset(offsetRef.current);

        const serverHasMore = json.length === LIMIT;

        // AUTOMATIC RECURSIVE CHECK
        if (updatedAccumulated.length < LIMIT && serverHasMore) {
          return await loadData(false, updatedAccumulated);
        }

        // FINAL RE-RENDER COMMIT (Strict isolation per sector)
        if (isNewSearch) {
          setData(updatedAccumulated);
        } else {
          setData(prev => {
            const combined = [...prev, ...updatedAccumulated];
            const uniqueMap = new Map(combined.map(item => [item.id, item]));
            return Array.from(uniqueMap.values());
          });
        }
        
        setHasMore(serverHasMore);
      }
    } catch (error) {
      console.error("Error loading vsales:", error);
    } finally {
      setLoading(false);
    }
  }, [search, activeSector]);

  // 2. RE-TRIGGER FLUSH AND INSTANT RESET ON SEARCH OR TAB CHANGE
  useEffect(() => {
    // ¡LA CLAVE ESTÁ AQUÍ! Vaciamos la tabla inmediatamente al cambiar de pestaña o buscar
    setData([]); 
    setHasMore(true);
    setLoading(true);

    const timer = setTimeout(() => {
      loadData(true);
    }, 400);
    
    return () => clearTimeout(timer);
  }, [search, activeSector, loadData]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in px-2">
      
      {/* HEADER SECTION */}
      <header className="border-b border-slate-200 dark:border-slate-800/60 pb-5">
        <h1 className="text-2xl font-[900] tracking-tighter text-slate-900 dark:text-white uppercase italic">
          Vessel Sales Market
        </h1>
        <p className="mt-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 tracking-tight">
          Historical asset deals, commercial evaluations, and liquidity transactions records.
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

      {/* SEARCH TERMINAL BAR */}
      <div className="flex items-center gap-4 bg-white dark:bg-slate-900/30 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/60 backdrop-blur-md">
        <div className="text-slate-400 dark:text-slate-500 pl-2 text-sm select-none">🔍</div>
        <input
          type="text"
          placeholder={`Global search in ${activeSector === "DB" ? "Dry Bulk" : activeSector} by vessel name, type, yard, or buyer...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs font-bold tracking-tight focus:outline-none focus:ring-0"
        />
        {loading && (
          <span className="text-[10px] font-mono font-black text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/10 uppercase animate-pulse">
            Syncing
          </span>
        )}
      </div>

      {/* HIGH-DENSITY LEDGER GRID */}
      <div className="overflow-hidden bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-sm dark:shadow-2xl backdrop-blur-md transition-colors duration-200">
        <table className="w-full border-collapse text-left table-fixed">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800/60 text-[9px] font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              <th className="py-3 px-3 w-[14%]">Vessel Name</th>
              <th className="py-3 px-2 w-[8%]">Type</th>
              <th className="py-3 px-2 w-[10%]">DWT</th>
              <th className="py-3 px-2 w-[6%]">Built</th>
              <th className="py-3 px-2 w-[14%]">Shipyard</th>
              <th className="py-3 px-2 w-[8%]">Flag</th>
              <th className="py-3 px-2 w-[14%]">Buyer Entity</th>
              <th className="py-3 px-2 w-[10%]">Price</th>
              <th className="py-3 px-2 w-[8%]">Status</th>
              <th className="py-3 px-3 w-[8%] text-right">Horizon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-[11px] font-medium font-mono text-slate-700 dark:text-slate-300">
            {data.length > 0 ? (
              data.map((sale) => (
                <tr 
                  key={sale.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors duration-150"
                >
                  <td className="py-2.5 px-3 font-sans font-black text-slate-800 dark:text-white text-xs tracking-tight break-words">
                    {sale.name}
                  </td>
                  <td className="py-2.5 px-2 font-sans text-slate-500 dark:text-slate-400 truncate">
                    {sale.type}
                  </td>
                  <td className="py-2.5 px-2 font-bold text-slate-900 dark:text-slate-100">
                    {sale.dwt ? sale.dwt.toLocaleString() : '-'}
                  </td>
                  <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">
                    {sale.year_b}
                  </td>
                  <td className="py-2.5 px-2 font-sans text-slate-500 dark:text-slate-400 break-words leading-tight">
                    {sale.yard || '-'}
                  </td>
                  <td className="py-2.5 px-2 font-sans uppercase text-[10px] text-slate-400 tracking-wide truncate">
                    {sale.country || '-'}
                  </td>
                  <td className="py-2.5 px-2 font-sans text-slate-600 dark:text-slate-400 break-words leading-tight">
                    {sale.buyer || '-'}
                  </td>
                  <td className="py-2.5 px-2 font-sans font-black">
                    {sale.price ? (
                      <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px]">
                        ${sale.price}M
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 italic text-[10px]">
                        Undisc.
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 font-sans">
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/40 text-slate-500 dark:text-slate-400">
                      {sale.status || 'Done'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-400 dark:text-slate-500 text-[10px]">
                    {`W${sale.week}/${sale.year_r}`}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="py-16 text-center font-sans">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono tracking-wider uppercase">
                    {loading ? "Syncing financial streams..." : "No operational entries found matching current criteria."}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER PAGINATION CONTROL */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <button 
            onClick={() => loadData(false)} 
            disabled={loading} 
            className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-black tracking-widest uppercase rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50 text-slate-700 dark:text-slate-300"
          >
            {loading ? "Syncing..." : "Load More Market Transactions"}
          </button>
        </div>
      )}

    </div>
  );
}