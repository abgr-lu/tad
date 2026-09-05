"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SignInForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'subscription_expired') {
      setInfoMessage('⚠️ Your subscription period has expired. Please sign in to renew your operational access.');
    } else if (errorParam === 'auth_required') {
      setInfoMessage('🔐 Authentication required. Please sign in to access the secure terminal.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      const data = await res.json();
      window.location.href = data.redirectTo; 
    } else {
      const errorData = await res.json();
      setError(errorData.error || 'Authentication rejected. Verify credentials.');
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-2xl shadow-black/50 animate-fade-in">
      
      {/* ENCABEZADO CORPORATIVO OURIOS */}
      <div className="text-center mb-8">
        <div className="mb-2">
          <span className="text-3xl font-black tracking-tighter text-white uppercase italic">Ourios</span>
        </div>
        <h2 className="text-xs font-black tracking-[0.25em] text-slate-400 uppercase mt-1">
          Secure Terminal Access
        </h2>
      </div>

      {infoMessage && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs font-semibold text-blue-300 italic leading-relaxed">
          {infoMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-400 font-mono">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
            Email Address
          </label>
          <input 
            type="email" 
            required 
            placeholder="name@company.com"
            onChange={e => setForm({...form, email: e.target.value})} 
            className="w-full bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-xs font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                Access Password
              </label>
              <Link 
                href="/forgot-password" 
                className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input 
              type="password" 
              required 
              placeholder="••••••••••••"
              onChange={e => setForm({...form, password: e.target.value})} 
              className="w-full bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-xs font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

        <button 
          type="submit" 
          className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black tracking-widest uppercase rounded-xl transition-all shadow-xl shadow-blue-600/10 active:scale-[0.98] cursor-pointer"
        >
          Authorize Entry
        </button>
      </form>

      <div className="mt-8 text-center">
        <button 
          onClick={() => router.push('/')}
          className="text-[10px] font-black tracking-wider text-slate-500 hover:text-white uppercase transition-colors"
        >
          ← Return to Pricing Plans
        </button>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <main className="relative min-h-screen w-full bg-slate-950 font-sans flex items-center justify-center selection:bg-blue-500/30">
      
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/bg_02.jpeg')` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      </div>

      <Suspense fallback={
        <div className="relative z-10 w-full max-w-md mx-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 flex justify-center items-center h-[400px]">
          <span className="text-blue-400 text-sm font-bold animate-pulse uppercase tracking-widest">Loading secure terminal...</span>
        </div>
      }>
        <SignInForm />
      </Suspense>
      
    </main>
  );
}