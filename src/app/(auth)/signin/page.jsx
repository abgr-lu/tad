"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(form)
    });
    if (res.ok) {
    // Esto fuerza a Next.js a refrescar las cookies antes de saltar
    window.location.href = '/dashboard'; 
  } else {
    alert("Error al entrar");
  }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto' }}>
      <h2>Entrar</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="email" placeholder="Email" required onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder="Contraseña" required onChange={e => setForm({...form, password: e.target.value})} />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
