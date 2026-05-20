"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/app/components/LogoutButton";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        const userData = Array.isArray(data) ? data : data;
        setUser(userData);
      });
  }, []);

  const sidebarLinks = [
    { name: "Inicio", href: "/dashboard", icon: "🏢" },
    { name: "Compañías", href: "/dashboard/companies", icon: "🏢" },
    { name: "V-Values", href: "/dashboard/vvalues", icon: "📊" },
    { name: "V-Sales", href: "/dashboard/vsales", icon: "🚢" },
    { name: "Order Book", href: "/dashboard/ob", icon: "📋" },
    { name: "Shorts", href: "/dashboard/shorts", icon: "📉" },
    { name: "Mi Perfil", href: "/dashboard/profile", icon: "⚙️" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-blue-500/30">
      
      {/* SIDEBAR FIJO DE ALTA DENSIDAD */}
      <nav className="w-64 bg-slate-900 border-r border-slate-800/80 p-6 flex flex-col justify-between fixed h-screen shrink-0 z-10">
        
        <div className="flex flex-col flex-1">
          {/* IDENTIDAD DE MARCA AEGIS */}
          <div className="border-b border-slate-800/80 pb-6 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">🚢</span>
              <h2 className="text-lg font-[900] tracking-tighter uppercase italic text-white">
                Aegis <span className="text-blue-500 font-medium not-italic text-xs tracking-widest ml-0.5">ANALYTICS</span>
              </h2>
            </div>
            <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-1.5">
              Maritime Intelligence Terminal
            </p>
          </div>

          {/* MENÚ DE NAVEGACIÓN PRINCIPAL */}
          <ul className="space-y-1 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {sidebarLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-3 text-slate-400 font-bold text-sm px-4 py-2.5 rounded-xl transition-all hover:bg-slate-800/50 hover:text-white group border border-transparent hover:border-slate-800"
                >
                  <span className="text-base group-hover:scale-110 transition-transform duration-200">
                    {link.icon}
                  </span>
                  <span className="tracking-tight">{link.name}</span>
                </Link>
              </li>
            ))}

            {/* BOTÓN AYUDA Y SOPORTE */}
            <li className="pt-4">
              <Link
                href="/dashboard/support"
                className="flex items-center justify-center gap-2 text-xs font-black tracking-wider uppercase text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 text-center block py-3 px-4 rounded-xl transition-all"
              >
                <span>💬</span> Ayuda y Soporte
              </Link>
            </li>
          </ul>
        </div>

        {/* SECCIÓN DE USUARIO CONSERVANDO ESTRUCTURA E IMAGEN */}
        <div className="border-t border-slate-800/80 pt-5 mt-5 flex flex-col items-center gap-3">
          
          {/* Contenedor del Avatar */}
          <div className="w-14 h-14 rounded-full bg-blue-600/20 border-2 border-blue-500/40 text-blue-400 flex items-center justify-center text-xl font-black shadow-lg shadow-blue-500/5 overflow-hidden shrink-0">
            {user?.image ? (
              <img
                src={user.image}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.charAt(0).toUpperCase() || "?"
            )}
          </div>

          {/* Nombre de Usuario */}
          <div className="text-sm font-black text-white tracking-tight text-center max-w-full truncate px-2">
            {user?.name}
          </div>

          {/* Botón de Logout original integrado */}
          <div className="w-full bg-slate-950/40 p-1 rounded-xl border border-slate-800/40 hover:border-red-500/20 transition-all">
            <LogoutButton />
          </div>
        </div>

      </nav>

      {/* ÁREA DE CONTENIDO PRINCIPAL CON MARGEN RESPECTO AL SIDEBAR FIJO */}
      <main className="flex-1 p-10 ml-64 bg-slate-950 overflow-y-auto min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}