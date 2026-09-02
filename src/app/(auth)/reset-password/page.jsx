"use client";
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Capturamos el código de la URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setStatus({ type: 'error', message: 'Invalid or missing security token.' });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match. Please check them.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Updating security credentials...' });

    // Llamada a la API de actualización
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: form.password })
    });

    if (res.ok) {
      setStatus({ type: 'success', message: 'Password updated successfully! Redirecting...' });
      setTimeout(() => router.push('/signin'), 3000);
    } else {
      setStatus({ type: 'error', message: 'Token has expired or is invalid. Please request a new link.' });
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
          Set New Password
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

      {!token && status.type === '' ? (
        <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-400 font-mono">
          ❌ No token found in URL. Please use the link sent to your email.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              New Access Password
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
              Confirm New Password
            </label>
            <input 
              type="password" 
              required 
              placeholder="••••••••••••"
              onChange={e => setForm({...form, confirmPassword: e.target.value})} 
              className="w-full bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-xs font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button 
            type="submit" 
            disabled={status.type === 'loading'}
            className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white text-xs font-black tracking-widest uppercase rounded-xl transition-all shadow-xl shadow-blue-600/10 active:scale-[0.98] cursor-pointer"
          >
            Update Password
          </button>
        </form>
      )}

      <div className="mt-8 text-center">
        <Link href="/signin" className="text-[10px] font-black tracking-wider text-slate-500 hover:text-white uppercase transition-colors">
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPassword() {
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
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}