"use client";
import { useState } from 'react';

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark');
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <main className="relative min-h-screen w-full bg-slate-950 font-sans selection:bg-blue-500/30">
        
        {/* IMAGEN DE FONDO CON FILTRO PROFESIONAL */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('/bg_02.jpeg')`,
          }}
        >
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/50' : 'bg-slate-900/5'} backdrop-brightness-85`} />
        </div>

        {/* HEADER */}
        <nav className="relative z-50 flex justify-between items-center px-10 py-8">
          <div>
            <span className="text-3xl font-black tracking-tighter text-white">Aegis</span>
            <span className="text-3xl font-black tracking-tighter text-blue-400"> Maritime</span>
            </div>
          <div className="flex items-center gap-6">
            <button className="text-sm font-bold text-white/80 hover:text-white transition-colors">SIGN IN</button>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-full font-bold text-sm shadow-xl shadow-blue-500/20 transition-all active:scale-95">
              SIGN UP
            </button>
          </div>
        </nav>

        {/* CONTENIDO CENTRAL */}
        <div className="relative z-10 flex flex-col items-center justify-center pt-20 px-4">
          
          {/* TEXTO ESTILO PANTALLAZO (Extra Bold) */}
          <div className="text-center max-w-6xl">
            <h1 className="text-6xl md:text-8xl font-[900] text-white leading-[0.9] tracking-tighter uppercase italic">
              PREMIUM ACCESS FOR: <br/>
              
              <span className="text-blue-500">TANKERS & DRY BULK</span>
              <span className="text-white"> SECTORS</span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-white/60 font-bold tracking-[0.2em] uppercase">
              Key data for successful investing in shipping
            </p>
          </div>
          

          {/* TARJETAS GLASSMORPHISM MEJORADAS */}
          <div className="mt-16 grid md:grid-cols-2 gap-8 w-full max-w-5xl px-4 pb-5">
            
            {/* Mensual */}
            <div className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 overflow-hidden transition-all hover:bg-white/10">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 blur-[80px] rounded-full group-hover:bg-blue-600/30 transition-all" />
              
              <h3 className="text-xs font-black tracking-[0.3em] text-blue-400 uppercase mb-8">Monthly Premium</h3>
              <div className="flex items-baseline gap-2 text-white">
                <span className="text-6xl font-black tracking-tighter">$199</span>
                <span className="text-xl font-bold opacity-40">/MO</span>
              </div>

              <div className="mt-10 space-y-5">
                {['Models x20 Tankers & Dry Bulk most popular companies: Okeanis, Frontline, DHT, Himalaya shipping...', 'Vessels Values', 'Order Book', 'Shipping Shorts Updates', 'Vessels Secondhand sales'].map((i) => (
                  <div key={i} className="flex items-center gap-3 text-white/70 font-semibold text-sm border-b border-white/5 pb-3 italic">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" /> {i}
                  </div>
                ))}
              </div>

              <button className="mt-12 w-full bg-white text-black py-5 rounded-2xl font-black text-xs tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all uppercase">
                Get Started
              </button>
            </div>

            {/* Anual */}
            <div className="group relative bg-blue-600/10 backdrop-blur-3xl border border-blue-500/30 rounded-[40px] p-10 overflow-hidden transition-all hover:scale-[1.02] shadow-2xl shadow-blue-500/10">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/30 blur-[80px] rounded-full" />
              
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-xs font-black tracking-[0.3em] text-blue-300 uppercase">Annual Premium</h3>
                <span className="bg-blue-500 text-[10px] font-black px-3 py-1 rounded-full text-white tracking-tighter">BEST VALUE</span>
              </div>

              <div className="flex items-baseline gap-2 text-white">
                <span className="text-6xl font-black tracking-tighter">$1194</span>
                <span className="text-xl font-bold opacity-40">/YR</span>
              </div>

              <div className="mt-10 space-y-5">
                <div className="text-white font-black text-sm italic">✓ All Monthly Features</div>
                <div className="text-blue-300 font-black text-sm italic underline decoration-blue-500/50 underline-offset-4">✓ Save 50%</div>
                <div className="text-white font-black text-sm italic"></div>
              </div>

              <button className="mt-12 w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs tracking-[0.2em] hover:bg-blue-400 transition-all shadow-lg shadow-blue-600/40 uppercase">
                Claim Annual Offer
              </button>
            </div>
          </div>

          {/* TARJETAS GLASSMORPHISM MEJORADAS */}
          <div className="mt-16 grid md:grid-cols-1 gap-8 w-full max-w-5xl px-4 pb-20 justify-items-center">

            {/* New Users */}
            <div className="group relative bg-blue-600/10 backdrop-blur-3xl border border-blue-500/30 rounded-[40px] p-10 overflow-hidden transition-all hover:scale-[1.02] shadow-2xl shadow-blue-500/10">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/30 blur-[80px] rounded-full" />
              
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-xs font-black tracking-[0.3em] text-blue-300">You don´t know us, we understand. So...</h3>
                <h3 className="text-xs font-black tracking-[0.3em] text-blue-300 uppercase">Launch Offer Only for New Users</h3>
                <span className="bg-blue-500 text-[10px] font-black px-3 py-1 rounded-full text-white tracking-tighter">BEST VALUE</span>
              </div>

              <div className="flex items-baseline gap-2 text-white">
                <span className="text-6xl font-black tracking-tighter">$199</span>
                <span className="text-xl font-bold opacity-40">/FIRST SIX MONTHS FOR NEW USERS</span>
              </div>

              <div className="mt-10 space-y-5">
                <div className="text-white font-black text-sm italic">✓ All Monthly Features</div>
                <div className="text-blue-300 font-black text-sm italic underline decoration-blue-500/50 underline-offset-4">✓ We're so confident in what we can offer you that you have the option to pay for just one month out of the first six. After that, there's no commitment, but you'll want to stay with us forever</div>
                
              </div>

              <button className="mt-12 w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs tracking-[0.2em] hover:bg-blue-400 transition-all shadow-lg shadow-blue-600/40 uppercase">
                Claim New User Offer
              </button>
            </div>
          </div>


        </div>

        {/* SELECTOR DE MODO */}
        <button 
          onClick={toggleTheme}
          className="fixed bottom-10 right-10 z-50 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full text-[10px] font-black text-white tracking-[0.2em] hover:bg-white/20 transition-all"
        >
          {isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}
        </button>

      </main>
    </div>
  );
}