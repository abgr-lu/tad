"use client";
import { useState } from 'react';

export default function AdminCompaniesPage() {
  const [formData, setFormData] = useState({ name: '', ticket_1: '', ticket_2: '', ticket_3: '' });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setStatus({ type: 'error', message: 'Por favor, selecciona un archivo Excel' });

    setStatus({ type: 'loading', message: 'Subiendo datos y archivo...' });

    const dataToSend = new FormData();
    dataToSend.append('file', file);
    dataToSend.append('name', formData.name);
    dataToSend.append('ticket_1', formData.ticket_1);
    dataToSend.append('ticket_2', formData.ticket_2);
    dataToSend.append('ticket_3', formData.ticket_3);

    try {
      const response = await fetch('/api/admin/insert-with-file', {
        method: 'POST',
        body: dataToSend, // Importante: No añadir headers de Content-Type aquí
      });

      const result = await response.json();
      if (response.ok) {
        setStatus({ type: 'success', message: result.message });
        setFormData({ name: '', ticket_1: '', ticket_2: '', ticket_3: '' });
        setFile(null);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Nueva Compañía con Modelo Excel</h1>
      <form onSubmit={handleSubmit} style={formContainerStyle}>
        <input style={inputStyle} type="text" placeholder="Nombre" required 
               onChange={e => setFormData({...formData, name: e.target.value})} value={formData.name} />
        
        <input style={inputStyle} type="text" placeholder="Ticker 1" required 
               onChange={e => setFormData({...formData, ticket_1: e.target.value})} value={formData.ticket_1} />

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Modelo Excel (.xlsx)</label>
          <input type="file" accept=".xlsx" onChange={e => setFile(e.target.files[0])} />
        </div>

        <button type="submit" style={btnStyle}>Guardar Compañía</button>

        {status.message && <div style={statusStyle(status.type)}>{status.message}</div>}
      </form>
    </div>
  );
}

// Estilos básicos
const formContainerStyle = { background: '#fff', padding: '25px', borderRadius: '10px', border: '1px solid #ddd' };
const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' };
const btnStyle = { width: '100%', padding: '12px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const statusStyle = (type) => ({ marginTop: '15px', padding: '10px', borderRadius: '5px', textAlign: 'center', 
                                background: type === 'success' ? '#e6f4ea' : '#fce8e6', color: type === 'success' ? '#137333' : '#c5221f' });