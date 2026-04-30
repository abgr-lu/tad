"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Pedir datos del usuario a la API que creamos arriba
    fetch('/api/user')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("No autorizado");
      })
      .then(data => setUser(data))
      .catch(() => router.push('/signin'));
  }, [router]);

  const logout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/signin');
  };

  if (!user) return <p>Cargando dashboard...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bienvenido de nuevo, {user.name} 👋</h1>
      <p>Estás logueado con: {user.email}</p>
      
      <hr />
      
      <button 
        onClick={logout} 
        style={{ background: 'red', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
