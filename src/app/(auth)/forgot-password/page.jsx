"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Verifying network and sending link...' });

    // Aquí llamaremos a la API que programaremos en el siguiente paso
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (res.ok) {
      setStatus({ type: 'success', message: 'If the email exists in our system, a recovery link has been sent.' });
      setEmail('');
    } else {
      setStatus({ type: 'error', message: 'An error occurred. Please try again later.' });
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-slate-950 font-sans flex items-center justify-center selection:bg-blue-500/30">
      
      {/* IMAGEN DE FONDO COMPARTIDA */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/bg_02.jpeg')` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-2xl shadow-black/50 animate-fade-in">
        
        <div className="text-center mb-8">
          <div className="mb-2">
            <span className="text-2xl font-black tracking-tighter text-white">Ourios</span>
            <span className="text-2xl font-black tracking-tighter text-blue-400"> Analytics</span>
          </div>
          <h2 className="text-xs font-black tracking-[0.25em] text-slate-400 uppercase">
            Password Recovery
          </h2>
        </div>

        {/* BANNERS DE ESTADO */}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Account Email Address
            </label>
            <input 
              type="email" 
              required 
              value={email}
              placeholder="name@company.com"
              onChange={e => setEmail(e.target.value)} 
              className="w-full bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-xs font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button 
            type="submit" 
            disabled={status.type === 'loading'}
            className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white text-xs font-black tracking-widest uppercase rounded-xl transition-all shadow-xl shadow-blue-600/10 active:scale-[0.98] cursor-pointer"
          >
            Send Recovery Link
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link 
            href="/signin"
            className="text-[10px] font-black tracking-wider text-slate-500 hover:text-white uppercase transition-colors"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}