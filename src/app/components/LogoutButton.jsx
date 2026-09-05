"use client";
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    if (confirm("¿Cerrar sesión de administrador?")) {
      await fetch('/api/auth/signout', { method: 'POST' });
      window.location.href = '/signin'; // Redirección total para limpiar estados
    }
  };

  return (
    <button 
      onClick={handleLogout}
      style={{
        width: '100%',
        padding: '10px',
        background: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
    >
      Sign out
    </button>
  );
}
