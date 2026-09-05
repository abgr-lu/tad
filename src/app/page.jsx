"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);

  const router = useRouter();

  const includedCompanies = [
    "Okeanis Eco Tankers",
    "Frontline",
    "DHT Holdings",
    "Nordic American Tankers (NAT)",
    "Teekay Tankers",
    "International Seaways",
    "Torm plc",
    "Scorpio Tankers",
    "Ardmore Shipping",
    "D'Amico",
    "Performance Shipping",
    "Pyxis Tankers",
    "Imperial Petroleum",
    "Himalaya Shipping",
    "Star Bulk Carriers",
    "Genco Shipping",
    "Safe Bulkers",
    "Seanergy Maritime",
    "United Maritime",
    "Pangaea Logistics Solutions",
    "Diana Shipping"
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark');
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setIsProcessing(true);

    try {
      const checkRes = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const checkData = await checkRes.json();

      if (checkData.exists) {
        setEmailError('This email is already registered. Please sign in to choose a plan.');
        setIsExistingUser(true);
        setIsProcessing(false);
        return;
      }

      const stripeRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_NEW_USER,
          email: email,
          mode: 'payment'
        }),
      });
      
      const stripeData = await stripeRes.json();

      if (stripeData.url) {
        window.location.href = stripeData.url;
      } else {
        setEmailError('Failed to connect to payment portal.');
      }
    } catch (error) {
      setEmailError('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <main className="relative min-h-screen w-full bg-slate-950 font-sans selection:bg-blue-500/35">
        
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/bg_02.jpeg')` }}
        >
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/50' : 'bg-slate-900/5'} backdrop-brightness-85`} />
        </div>

        {/* NAVEGACIÓN Y LOGOTIPO CON EFECTO DE LÍNEAS MARÍTIMAS */}
        <nav className="relative z-50 flex justify-between items-center px-10 py-8">
          <div className="flex flex-col">
            <span className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">Ourios</span>
            {/* Líneas horizontales tenues simulando las olas del mar */}
            <div className="flex flex-col gap-1 mt-1 opacity-70">
              <div className="h-[2px] w-full bg-gradient-to-r from-blue-500 via-sky-400 to-transparent rounded-full" />
              <div className="h-[1px] w-4/5 bg-gradient-to-r from-blue-400/50 to-transparent rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/signin" className="mt-12 w-full bg-blue-600 text-white py-3 px-3 rounded-2xl font-black text-xs tracking-[0.2em] hover:bg-blue-400 transition-all shadow-lg shadow-blue-600/40 uppercase cursor-pointer">SIGN IN</Link>
          </div>
        </nav>

        <div className="relative z-10 flex flex-col items-center justify-center pt-20 px-4">
          
          <div className="text-center max-w-6xl">
            <h1 className="text-4xl md:text-5xl font-[900] text-white leading-[0.9] tracking-tighter uppercase italic">
              ANALYTICS FOR SHIPPING INVESTORS <br/>
              <p><span className="text-blue-400">TANKERS & DRYBULK</span></p>
              <span className="text-white">SECTORS</span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-white/60 font-bold tracking-[0.2em] uppercase">
              Key data for successful investing in shipping
            </p>
          </div>
          
          <div className="mt-16 grid md:grid-cols-2 gap-8 w-full max-w-5xl px-4 pb-5">
            
            {/* Mensual */}
            <div className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 overflow-hidden transition-all hover:bg-white/10">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 blur-[80px] rounded-full group-hover:bg-blue-600/30 transition-all" />
              
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-xs font-black tracking-[0.3em] text-blue-300 uppercase">Monthly</h3>
                <span className="bg-slate-800/80 text-[9px] font-black px-3 py-1 rounded-full text-slate-300 tracking-widest border border-slate-700/50">FOR EXISTING CLIENTS</span>
              </div>

              <div className="flex items-baseline gap-2 text-white">
                <span className="text-6xl font-black tracking-tighter">$199</span>
                <span className="text-xl font-bold opacity-40">/MO</span>
              </div>

              <div className="mt-10 space-y-5">
                {['22 Excel models covering all the most popular companies', '2 master files with valuations (NAV, PER, EV/EBITDA, dividend yield)', 'Vessels Values', 'Order Book'].map((i) => (
                  <div key={i} className="flex items-center gap-3 text-white/70 font-semibold text-sm border-b border-white/5 pb-3 italic">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" /> {i}
                  </div>
                ))}
              </div>

              {/* BOTÓN O ENLACE "MORE DETAILS" AL FINAL DEL CUADRANTE */}
              <div className="mt-4 text-center">
                <button 
                  onClick={() => setIsDetailsModalOpen(true)}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest underline decoration-blue-500/40 underline-offset-4 transition-colors cursor-pointer"
                >
                  More Details →
                </button>
              </div>
              
              <button 
                onClick={() => router.push('/signin')}
                className="mt-12 w-full bg-white text-black py-5 rounded-2xl font-black text-xs tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all uppercase cursor-pointer"
              >
                Sign in
              </button>
            </div>

            {/* Anual */}
            <div className="group relative bg-blue-600/10 backdrop-blur-3xl border border-blue-500/30 rounded-[40px] p-10 overflow-hidden transition-all hover:scale-[1.02] shadow-2xl shadow-blue-500/10">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/30 blur-[80px] rounded-full" />
              
              <div className="flex flex-wrap justify-between items-start gap-2 mb-8">
                <h3 className="text-xs font-black tracking-[0.3em] text-blue-300 uppercase">Annual</h3>
                <div className="flex gap-2">
                  <span className="bg-slate-800/80 text-[9px] font-black px-3 py-1 rounded-full text-slate-300 tracking-widest border border-slate-700/50">FOR EXISTING CLIENTS</span>
                  <span className="bg-blue-500 text-[10px] font-black px-3 py-1 rounded-full text-white tracking-tighter">BEST VALUE</span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 text-white">
                <span className="text-6xl font-black tracking-tighter">$1194</span>
                <span className="text-xl font-bold opacity-40">/YR</span>
              </div>

              <div className="mt-10 space-y-5">
                <div className="text-white font-semibold text-sm italic">✓ All Monthly Features</div>
                <div className="text-blue-300 font-semibold text-sm italic underline decoration-blue-500/50 underline-offset-4">✓ Save 50%</div>
              </div>

              <button 
                onClick={() => router.push('/signin')}
                className="mt-12 w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs tracking-[0.2em] hover:bg-blue-400 transition-all shadow-lg shadow-blue-600/40 uppercase cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </div>

          {/* New Users */}
          <div className="mt-16 grid md:grid-cols-1 gap-8 w-full max-w-5xl px-4 pb-20 justify-items-center">
            <div className="group relative bg-blue-600/10 backdrop-blur-3xl border border-blue-500/30 rounded-[40px] p-10 overflow-hidden transition-all hover:scale-[1.02] shadow-2xl shadow-blue-500/10 w-full">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/30 blur-[80px] rounded-full" />
              
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-xs tracking-[0.3em] text-blue-300 font-semibold">You don´t know us, we understand. So...</h3>
                <h3 className="text-xs font-black tracking-[0.3em] text-blue-300 uppercase">Launch Offer Only for New Users</h3>
                <span className="bg-blue-500 text-[10px] font-black px-3 py-1 rounded-full text-white tracking-tighter">BEST VALUE</span>
              </div>

              <div className="flex items-baseline gap-2 text-white">
                <span className="text-6xl font-black tracking-tighter">$199</span>
                <span className="text-xl font-bold opacity-40">/FIRST SIX MONTHS FOR NEW USERS</span>
              </div>

              <div className="mt-10 space-y-5">
                <div className="text-white font-semibold text-sm italic">✓ All Monthly Features</div>
                <div className="text-blue-300 font-semibold text-sm italic underline decoration-blue-500/50 underline-offset-4">✓ We're so confident in what we can offer you that you have the option to pay for just one month out of the first six. After that, there's no commitment, but you'll want to stay with us forever</div>
              </div>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-12 w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs tracking-[0.2em] hover:bg-blue-400 transition-all shadow-lg shadow-blue-600/40 uppercase cursor-pointer"
              >
                Claim New User Offer
              </button>

            </div>
          </div>
        </div>

        {/* VENTANA FLOTANTE (MODAL) PARA CORREO (CHECKOUT) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[30px] p-8 shadow-2xl">
              
              <button 
                onClick={() => { 
                  setIsModalOpen(false); 
                  setEmailError(''); 
                  setIsExistingUser(false); 
                  setEmail('');
                }}
                className="absolute top-6 right-6 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>

              <h3 className="text-xl font-black text-white mb-2 uppercase italic tracking-tighter">Enter your email</h3>
              <p className="text-xs text-slate-400 mb-6 font-semibold">We need to verify that you are a new user before proceeding to secure checkout.</p>

              <form onSubmit={handleEmailSubmit}>
                <input 
                  type="email" 
                  required 
                  placeholder="investor@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsExistingUser(false);
                    setEmailError('');
                  }}
                  className="w-full bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-4 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors mb-4"
                />

                {emailError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-400">
                    {emailError}
                  </div>
                )}

                {isExistingUser ? (
                  <button 
                    type="button" 
                    onClick={() => router.push('/signin')}
                    className="w-full bg-slate-700 text-white py-4 rounded-xl font-black text-xs tracking-[0.2em] hover:bg-slate-600 transition-all uppercase cursor-pointer"
                  >
                    Go to Sign In
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-xs tracking-[0.2em] hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase cursor-pointer"
                  >
                    {isProcessing ? 'Verifying...' : 'Continue to Payment'}
                  </button>
                )}
              </form>
            </div>
          </div>
        )}

        {/* NUEVA VENTANA MODAL "MORE DETAILS" CON ESPECIFICACIONES Y OFERTA */}
        {isDetailsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[30px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              
              <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white font-mono text-sm uppercase tracking-wider cursor-pointer bg-slate-800/50 hover:bg-slate-800 px-3 py-1 rounded-lg transition-colors"
              >
                Close [X]
              </button>

              <div className="space-y-4 text-xs font-medium text-slate-300 leading-relaxed mb-8">
                <span className="text-3xl font-black tracking-tighter text-white uppercase italic">Ourios</span>
                {/* Líneas horizontales tenues simulando las olas del mar */}
                <div className="flex flex-col gap-1 mt-1 opacity-70 mb-4">
                  <div className="h-[2px] w-32 bg-gradient-to-r from-blue-500 via-sky-400 to-transparent rounded-full" />
                  <div className="h-[1px] w-24 bg-gradient-to-r from-blue-400/50 to-transparent rounded-full" />
                </div>

                <p className="font-bold text-white text-sm">Do you want to invest in shipping as a professional investor?</p>
                <p className="font-bold text-white text-sm">Are you already investing and you want to save a lot of time having the models already done and updated?</p>
                <p className="font-bold text-white text-sm">Would you like to play with the models making your own assumptions?</p>
                <p className="font-bold text-white text-sm">Do you want to know the vessel values without being inflated at any time?</p>

                <div className="border-t border-slate-800 pt-6 mt-6">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider mb-3">Enjoy:</h4>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 mb-6">
                    <li>Vessels Valuations daily updated</li>
                    <li>2 Master models: you just need to keep these 2 models open to see and summarize all the main info you need to know to see if it's or not a good moment to invest.</li>
                  </ul>

                  <h4 className="text-sm font-black text-white uppercase tracking-wider mb-3">Models of:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {includedCompanies.map((company, index) => (
                      <div key={index} className="flex items-center gap-2 p-2.5 bg-slate-950/60 border border-white/5 rounded-xl text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="font-semibold">{company}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CONTENEDOR FLEX CENTRADO PARA EL BOTÓN "Claim Offer Now" */}
              <div className="flex flex-col items-center text-center p-6 bg-blue-600/10 border border-blue-500/30 rounded-2xl my-6">
                <p className="text-blue-300 font-bold text-sm mb-4">
                  Now you have everything for a very fair price. Only $199/month. But, if you are a new user, try our "new users launch offer" just paying $199 for the first six months.
                </p>
                <button
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs tracking-widest uppercase px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/40 cursor-pointer"
                >
                  Claim Offer Now ($199 / 6 Months)
                </button>
              </div>

              <div className="border-t border-slate-800 pt-6 flex justify-end">
                <button 
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>

            </div>
          </div>
        )}

        <button 
          onClick={toggleTheme}
          className="fixed bottom-10 right-10 z-50 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full text-[10px] font-black text-white tracking-[0.2em] hover:bg-white/20 transition-all cursor-pointer"
        >
          {isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}
        </button>

      </main>
    </div>
  );
}