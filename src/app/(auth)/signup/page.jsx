"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(form)
    });
    if (res.ok) router.push('/signin');
    else alert("Error al registrarse. ¿Quizás el email ya existe?");
  };

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto' }}>
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" placeholder="Nombre" required onChange={e => setForm({...form, name: e.target.value})} />
        <input type="email" placeholder="Email" required onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder="Contraseña" required onChange={e => setForm({...form, password: e.target.value})} />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
