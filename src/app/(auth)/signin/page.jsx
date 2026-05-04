"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); // Añadido para feedback
  const router = useRouter();

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
      setError(errorData.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto' }}>
      <h2>Entrar</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="email" 
          placeholder="Email" 
          required 
          onChange={e => setForm({...form, email: e.target.value})} 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          required 
          onChange={e => setForm({...form, password: e.target.value})} 
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
