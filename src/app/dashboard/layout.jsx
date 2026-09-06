"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/app/components/LogoutButton";
import { usePathname } from "next/navigation"; // Para cerrar el menú al cambiar de página

const Icons = {
  Overview: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
  Companies: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>,
  VValues: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
  Profile: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
  Support: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.43 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" /></svg>,
  Sun: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>,
  Moon: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
};

function ThemeToggle({ isDark, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center gap-2 w-full text-[10px] font-bold tracking-widest uppercase py-3 px-4 rounded-lg border transition-all bg-slate-100 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800"
    >
      {isDark ? (
        <><Icons.Sun /> Light Mode</>
      ) : (
        <><Icons.Moon /> Dark Mode</>
      )}
    </button>
  );
}

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [loadingPriceId, setLoadingPriceId] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // ESTADO PARA EL MENÚ MÓVIL
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Cerrar el menú al cambiar de página en móvil
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        const userData = Array.isArray(data) ? data[0] : data;
        setUser(userData);
        
        if (userData && !userData.super) {
          if (!userData.subscription_ends_at) {
            setIsExpired(true);
          } else {
            const dateStr = String(userData.subscription_ends_at).trim();
            const parts = dateStr.split(/[- :T]/);
            
            if (parts.length >= 3) {
              const year = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10) - 1;
              const day = parseInt(parts[2], 10);
              
              const expirationDate = new Date(year, month, day, 23, 59, 59).getTime();
              const currentTime = new Date().getTime();
              
              if (currentTime > expirationDate) {
                setIsExpired(true);
              } else {
                setIsExpired(false);
              }
            } else {
              setIsExpired(true);
            }
          }
        }
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

  const handleCheckout = async (priceId) => {
    if (!priceId) return;
    setLoadingPriceId(priceId);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: priceId,
          email: user?.email,
          mode: 'subscription'
        }),
      });

      const data = await response.json();
      if (data.url) {
        setIsRedirecting(true);
        window.location.href = data.url; 
        return; 
      }
    } catch (error) {
      console.error("Error al iniciar el pago:", error);
    } 
    
    setLoadingPriceId(null);
    setIsRedirecting(false);
  };

  const sidebarLinks = [
    { name: "Overview", href: "/dashboard", icon: <Icons.Overview /> },
    { name: "Companies", href: "/dashboard/companies", icon: <Icons.Companies /> },
    { name: "V-Values", href: "/dashboard/vvalues", icon: <Icons.VValues /> },
    { name: "My Profile", href: "/dashboard/profile", icon: <Icons.Profile /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] font-sans text-slate-900 dark:text-slate-100 antialiased transition-colors duration-200 selection:bg-blue-500/30">
      
      {/* OVERLAY FONDO OSCURO PARA MÓVIL CUANDO EL MENÚ ESTÁ ABIERTO */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* BARRA LATERAL (Responsiva) */}
      <nav className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800/60 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="flex flex-col flex-1">
          <div className="border-b border-slate-200 dark:border-slate-800/60 pb-6 mb-6 flex justify-between items-center">
            
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">Ourios</span>
              <div className="flex flex-col gap-0.5 mt-1 opacity-70">
                <div className="h-[2px] w-full bg-gradient-to-r from-blue-500 via-sky-400 to-transparent rounded-full" />
                <div className="h-[1px] w-4/5 bg-gradient-to-r from-blue-400/50 to-transparent rounded-full" />
              </div>
            </div>

            {/* BOTÓN CERRAR SOLO EN MÓVIL */}
            <button 
              className="md:hidden text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icons.Close />
            </button>
          </div>

          <ul className="space-y-1.5 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {sidebarLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-semibold text-sm px-4 py-2.5 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400 group"
                >
                  <span className="text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {link.icon}
                  </span>
                  <span className="tracking-tight">{link.name}</span>
                </Link>
              </li>
            ))}

            <li className="pt-6">
              <Link
                href="/dashboard/support"
                className="flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-center py-3 px-4 rounded-lg transition-all"
              >
                <Icons.Support /> Support
              </Link>
            </li>
          </ul>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800/60 pt-6 mt-6 flex flex-col items-center gap-4">
          <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
          <div className="flex items-center gap-3 w-full bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800/60">
            <div className="w-9 h-9 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-sm font-bold overflow-hidden shrink-0">
              {user?.image ? (
                <img src={user.image} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase() || ""
              )}
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight truncate flex-1">
              {user?.name}
            </div>
          </div>
          <div className="w-full">
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 transition-all duration-200 md:ml-64 min-h-screen relative bg-[#F8FAFC] dark:bg-[#0B1120]">
        
        {/* BARRA SUPERIOR MÓVIL (Menú hamburguesa) */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-30">
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none">Ourios</span>
          </div>
          <button 
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Icons.Menu />
          </button>
        </div>

        <div className={`p-4 sm:p-10 max-w-7xl mx-auto transition-all duration-500 ${isExpired ? 'blur-[8px] pointer-events-none select-none opacity-50' : ''}`}>
          {children}
        </div>

        {/* PANTALLA DE SUSCRIPCIÓN EXPIRADA */}
        {isExpired && (
          <div className="absolute inset-0 z-50 flex items-start justify-center pt-[15vh]">
            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 rounded-2xl shadow-2xl max-w-lg w-full text-center mx-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2 uppercase italic">
                Access Expired
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">
                Your Ourios Analytics subscription has ended. Choose a plan below to securely reactivate your account and restore full access to the terminal.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* BOTÓN MENSUAL */}
                <button 
                  onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY)}
                  disabled={loadingPriceId !== null} 
                  className="w-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 font-bold text-xs tracking-widest uppercase py-4 rounded-xl transition-colors disabled:opacity-50 flex flex-col items-center justify-center gap-1"
                >
                  {loadingPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY ? (
                    isRedirecting ? 'Redirecting...' : 'Processing...'
                  ) : (
                    <>
                      <span>Monthly Plan</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Reactivate Monthly</span>
                    </>
                  )}
                </button>
                
                {/* BOTÓN ANUAL */}
                <button 
                  onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL)}
                  disabled={loadingPriceId !== null} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-widest uppercase py-4 rounded-xl transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 flex flex-col items-center justify-center gap-1 relative overflow-hidden"
                >
                  {loadingPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL ? (
                    isRedirecting ? 'Redirecting...' : 'Processing...'
                  ) : (
                    <>
                      <div className="absolute top-0 right-0 bg-blue-400 text-[8px] font-black px-2 py-0.5 rounded-bl-lg">SAVE 50%</div>
                      <span>Annual Plan</span>
                      <span className="text-[10px] text-blue-200 font-medium">Best Value</span>
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}