"use client";
import { useState } from 'react';

export default function SupportPage() {
  const [ticket, setTicket] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    const res = await fetch('/api/support', {
      method: 'POST',
      body: JSON.stringify(ticket)
    });

    if (res.ok) {
      alert("✅ Mensaje enviado. Te responderemos pronto.");
      setTicket({ subject: '', message: '' });
    }
    setSending(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <h1>💬 Centro de Soporte</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>¿Tienes alguna duda o problema técnico? Cuéntanos y te ayudaremos.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ fontWeight: 'bold' }}>Asunto</label>
          <input 
            type="text" 
            required 
            placeholder="Ej: Problema con los datos de V-Sales"
            value={ticket.subject}
            onChange={e => setTicket({...ticket, subject: e.target.value})}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ fontWeight: 'bold' }}>Mensaje</label>
          <textarea 
            required 
            placeholder="Escribe aquí tu consulta detallada..."
            value={ticket.message}
            onChange={e => setTicket({...ticket, message: e.target.value})}
            style={{ ...inputStyle, height: '150px', resize: 'none' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={sending}
          style={{ ...btnStyle, opacity: sending ? 0.7 : 1 }}
        >
          {sending ? 'Enviando...' : 'Enviar Consulta'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px', marginTop: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' };
const btnStyle = { padding: '14px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };
