"use client";
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState({ name: '', country: '', image: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user').then(res => res.json()).then(data => {
      const userData = Array.isArray(data) ? data : data;
      setUser({ name: userData?.name || '', country: userData?.country || '', image: userData?.image || '' });
      setLoading(false);
    });
  }, []);

  // 1. Manejo de Subida de Foto (4MB)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("⚠️ El archivo es demasiado grande. El máximo permitido es 4MB.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/user/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const { imageUrl } = await res.json();
      setUser({ ...user, image: imageUrl });
      alert("✅ Foto actualizada");
      window.location.reload(); 
    }
  };

  // 2. Guardar Datos Personales (Nombre y País)
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/user/update', { method: 'PUT', body: JSON.stringify(user) });
    if (res.ok) {
      alert("✅ Datos personales actualizados");
      window.location.reload();
    }
  };

  // 3. Cambiar Contraseña
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return alert("❌ Las nuevas contraseñas no coinciden");

    const res = await fetch('/api/user/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new })
    });

    if (res.ok) {
      alert("✅ Contraseña cambiada con éxito");
      setPasswords({ current: '', new: '', confirm: '' });
    } else {
      const error = await res.json();
      alert(`❌ ${error.error}`);
    }
  };

  if (loading) return <p style={{ padding: '40px' }}>Cargando perfil...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '50px' }}>
      
      {/* SECCIÓN 1: DATOS PERSONALES Y FOTO */}
      <div style={cardStyle}>
        <h1 style={{ marginBottom: '25px' }}>⚙️ Mi Cuenta</h1>
        
        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '30px' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#eee', margin: '0 auto', overflow: 'hidden', border: '3px solid #1a73e8' }}>
            {user.image ? (
              <img src={user.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ fontSize: '40px', marginTop: '30px' }}>👤</div>
            )}
          </div>
          <label style={{ display: 'block', marginTop: '15px', color: '#1a73e8', cursor: 'pointer', fontWeight: 'bold' }}>
            Cambiar Foto de Perfil
            <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
          </label>
          <small style={{ color: '#888' }}>Máximo 4MB (JPG, PNG)</small>
        </div>

        <form onSubmit={handleUpdateInfo} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Nombre completo</label>
            <input type="text" value={user.name} onChange={e => setUser({...user, name: e.target.value})} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>País</label>
            <input type="text" value={user.country} onChange={e => setUser({...user, country: e.target.value})} style={inputStyle} />
          </div>
          <button type="submit" style={btnStyle}>Guardar Datos Personales</button>
        </form>
      </div>

      {/* SECCIÓN 2: CAMBIAR CONTRASEÑA */}
      <div style={{ ...cardStyle, marginTop: '30px', borderTop: '4px solid #ea4335' }}>
        <h3 style={{ marginBottom: '20px' }}>🔐 Seguridad (Contraseña)</h3>
        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={labelStyle}>Contraseña Actual</label>
            <input type="password" required value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Nueva Contraseña</label>
            <input type="password" required value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Confirmar Nueva Contraseña</label>
            <input type="password" required value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} style={inputStyle} />
          </div>
          <button type="submit" style={{ ...btnStyle, background: '#ea4335' }}>Actualizar Contraseña</button>
        </form>
      </div>
      
    </div>
  );
}

// ESTILOS
const cardStyle = { background: 'white', padding: '35px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
const labelStyle = { fontSize: '14px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '5px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '14px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' };
