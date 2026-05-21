"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/app/components/LogoutButton";

function ThemeToggle({ isDark, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center gap-2 w-full text-xs font-black tracking-wider uppercase py-2 px-4 rounded-xl border transition-all bg-slate-100 dark:bg-slate-950/40 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800/40 hover:bg-slate-200 dark:hover:bg-slate-800/50"
    >
      {isDark ? (
        <><span>☀️</span> Light Mode</>
      ) : (
        <><span>🌙</span> Dark Mode</>
      )}
    </button>
  );
}

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        const userData = Array.isArray(data) ? data : data;
        setUser(userData);
      });

    const isDarkTheme = document.documentElement.classList.contains("dark") || 
                        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setIsDark(isDarkTheme);
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    window.requestAnimationFrame(() => {
      const root = document.documentElement;
      if (root.classList.contains("dark")) {
        root.classList.remove("dark");
        root.style.colorScheme = "light";
        localStorage.setItem("theme", "light");
        setIsDark(false);
      } else {
        root.classList.add("dark");
        root.style.colorScheme = "dark";
        localStorage.setItem("theme", "dark");
        setIsDark(true);
      }
    });
  };

  // Enlaces del menú traducidos al inglés estándar de la industria
  const sidebarLinks = [
    { name: "Overview", href: "/dashboard", icon: "🏢" },
    { name: "Companies", href: "/dashboard/companies", icon: "🏢" },
    { name: "V-Values", href: "/dashboard/vvalues", icon: "📊" },
    { name: "V-Sales", href: "/dashboard/vsales", icon: "🚢" },
    { name: "Order Book", href: "/dashboard/ob", icon: "📋" },
    { name: "Shorts", href: "/dashboard/shorts", icon: "📉" },
    { name: "My Profile", href: "/dashboard/profile", icon: "⚙️" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased transition-colors duration-200 selection:bg-blue-500/30">
      
      <nav className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 p-6 flex flex-col justify-between fixed h-screen shrink-0 z-10 transition-colors duration-200">
        
        <div className="flex flex-col flex-1">
          <div className="border-b border-slate-200 dark:border-slate-800/80 pb-6 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">🚢</span>
              <h2 className="text-lg font-[900] tracking-tighter uppercase italic text-slate-900 dark:text-white">
                Aegis <span className="text-blue-600 dark:text-blue-500 font-medium not-italic text-xs tracking-widest ml-0.5">ANALYTICS</span>
              </h2>
            </div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mt-1.5">
              Maritime Intelligence Terminal
            </p>
          </div>

          <ul className="space-y-1 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {sidebarLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold text-sm px-4 py-2.5 rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white group border border-transparent"
                >
                  <span className="text-base group-hover:scale-110 transition-transform duration-200">
                    {link.icon}
                  </span>
                  <span className="tracking-tight">{link.name}</span>
                </Link>
              </li>
            ))}

            <li className="pt-4">
              <Link
                href="/dashboard/support"
                className="flex items-center justify-center gap-2 text-xs font-black tracking-wider uppercase text-blue-600 dark:text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 text-center block py-3 px-4 rounded-xl transition-all"
              >
                <span>💬</span> Help & Support
              </Link>
            </li>
          </ul>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-5 mt-5 flex flex-col items-center gap-3">
          
          <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />

          <div className="flex items-center gap-3 w-full bg-slate-100/50 dark:bg-slate-950/20 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/40">
            <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-500 dark:text-blue-400 flex items-center justify-center text-sm font-black overflow-hidden shrink-0">
              {user?.image ? (
                <img src={user.image} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "?"
              )}
            </div>
            <div className="text-xs font-black text-slate-800 dark:text-white tracking-tight truncate flex-1">
              {user?.name}
            </div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-950/40 p-1 rounded-xl border border-slate-200 dark:border-slate-800/40 hover:border-red-500/20 transition-all">
            <LogoutButton />
          </div>
        </div>

      </nav>

      <main className="flex-1 p-10 ml-64 bg-slate-50 dark:bg-slate-950 transition-colors duration-200 overflow-y-auto min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}