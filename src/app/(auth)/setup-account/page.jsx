"use client";
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SetupAccountForm() {
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Capturamos el ID de la sesión de Stripe desde la URL
  const sessionId = searchParams.get('session_id'); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!sessionId) {
      setStatus({ type: 'error', message: 'No se detectó un pago válido. Vuelve a la página principal.' });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setStatus({ type: 'error', message: 'Las contraseñas no coinciden.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Creando tu cuenta segura...' });

    // Llamamos a nuestra nueva API
    const res = await fetch('/api/auth/setup-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, password: form.password })
    });

    const data = await res.json();

    if (res.ok) {
      setStatus({ type: 'success', message: 'Account successfully created! Taking you to Sign In...' });
      setTimeout(() => router.push('/signin'), 3000);
    } else {
      setStatus({ type: 'error', message: data.error || 'Error processing the request.' });
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-2xl shadow-black/50 animate-fade-in">
      <div className="text-center mb-8">
        <div className="mb-2">
          <span className="text-2xl font-black tracking-tighter text-white">Ourios</span>
          <span className="text-2xl font-black tracking-tighter text-blue-400"> Analytics</span>
        </div>
        <h2 className="text-xs font-black tracking-[0.25em] text-slate-400 uppercase">
          Welcome! Setup your password
        </h2>
      </div>

      {status.message && (
        <div className={`mb-6 p-4 border rounded-xl text-xs font-bold font-mono ${
          status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
          status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
          'bg-blue-500/10 border-blue-500/20 text-blue-400'
        }`}>
          {status.type === 'success' ? '✓ ' : status.type === 'error' ? '❌ ' : '⏳ '} 
          {status.message}
        </div>
      )}

      {!sessionId && status.type === '' ? (
        <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-400 font-mono">
          ❌ Payment session not found.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              New Password
            </label>
            <input 
              type="password" 
              required 
              placeholder="••••••••••••"
              onChange={e => setForm({...form, password: e.target.value})} 
              className="w-full bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-xs font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Confirm Password
            </label>
            <input 
              type="password" 
              required 
              placeholder="••••••••••••"
              onChange={e => setForm({...form, confirmPassword: e.target.value})} 
              className="w-full bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-xs font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* BOTÓN ACTUALIZADO CON ESTADO "PROCESSING..." Y "REDIRECTING..." */}
          <button 
            type="submit" 
            disabled={status.type === 'loading' || status.type === 'success'}
            className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white text-xs font-black tracking-widest uppercase rounded-xl transition-all shadow-xl shadow-blue-600/10 active:scale-[0.98] cursor-pointer"
          >
            {status.type === 'loading' 
              ? 'Processing...' 
              : status.type === 'success' 
                ? 'Redirecting...' 
                : 'Create Account'
            }
          </button>
        </form>
      )}
    </div>
  );
}

export default function SetupAccount() {
  return (
    <main className="relative min-h-screen w-full bg-slate-950 font-sans flex items-center justify-center selection:bg-blue-500/30">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/bg_02.jpeg')` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      </div>

      <Suspense fallback={<div className="relative z-10 w-full max-w-md mx-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 flex justify-center items-center h-[400px]">
        <span className="text-blue-400 text-sm font-bold animate-pulse uppercase tracking-widest">Loading secure portal...</span>
      </div>}>
        <SetupAccountForm />
      </Suspense>
    </main>
  );
}