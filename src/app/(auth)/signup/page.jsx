"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  // 1. Ampliamos el estado para incluir los campos de confirmación
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    confirmEmail: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiamos errores previos
    
    // 2. Lógica de validación: Comprobamos que el email coincida
    if (form.email !== form.confirmEmail) {
      setError("Email addresses do not match. Please check them.");
      return; // Detiene la ejecución de la función aquí
    }

    // Lógica de validación: Comprobamos que la contraseña coincida
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match. Please check them.");
      return; 
    }
    
    // 3. Preparamos solo los datos necesarios para tu API
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password
    };

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      router.push('/signin');
    } else {
      setError("Registration error. The email might already be in use.");
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

      {/* CONTENEDOR CENTRAL GLASSMORPHISM */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-2xl shadow-black/50 animate-fade-in my-8">
        
        {/* ENCABEZADO CORPORATIVO */}
        <div className="text-center mb-8">
          <div className="mb-2">
            <span className="text-2xl font-black tracking-tighter text-white">Ourios</span>
            <span className="text-2xl font-black tracking-tighter text-blue-400"> Analytics</span>
          </div>
          <h2 className="text-xs font-black tracking-[0.25em] text-slate-400 uppercase">
            New Account Registration
          </h2>
        </div>

        {/* BANNER DE ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-400 font-mono">
            ❌ {error}
          </div>
        )}

        {/* FORMULARIO DE REGISTRO */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* CAMPO: NOMBRE */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Full Name
            </label>
            <input 
              type="text" 
              required 
              placeholder="John Doe"
              onChange={e => setForm({...form, name: e.target.value})} 
              className="w-full bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-xs font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* CAMPO: EMAIL */}
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

          {/* CAMPO: CONFIRMAR EMAIL */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Confirm Email Address
            </label>
            <input 
              type="email" 
              required 
              placeholder="name@company.com"
              onChange={e => setForm({...form, confirmEmail: e.target.value})} 
              className="w-full bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-xs font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* CAMPO: CONTRASEÑA */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Access Password
            </label>
            <input 
              type="password" 
              required 
              placeholder="••••••••••••"
              onChange={e => setForm({...form, password: e.target.value})} 
              className="w-full bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-xs font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* CAMPO: CONFIRMAR CONTRASEÑA */}
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

          <button 
            type="submit" 
            className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black tracking-widest uppercase rounded-xl transition-all shadow-xl shadow-blue-600/10 active:scale-[0.98] cursor-pointer"
          >
            Create Account
          </button>
        </form>

        {/* ENLACE PARA VOLVER AL SIGN IN */}
        <div className="mt-8 text-center">
          <Link 
            href="/signin"
            className="text-[10px] font-black tracking-wider text-slate-500 hover:text-white uppercase transition-colors"
          >
            ← Already have an account? Sign in
          </Link>
        </div>

      </div>
    </main>
  );
}