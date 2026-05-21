"use client";
import { useState, useEffect, useCallback } from 'react';
import { COLORS } from '@/lib/ui-constants';

export default function AdminCompaniesPage() {
  const [formData, setFormData] = useState({ name: '', ticket_1: '', ticket_2: '', ticket_3: '', sector: 'Tankers' });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [companies, setCompanies] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const loadCompanies = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch('/api/admin/read?table=companies&limit=500');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCompanies(data.sort((a, b) => b.id - a.id));
      }
    } catch (err) {
      console.error("Error loading companies:", err);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this company?")) return;
    
    try {
      const res = await fetch(`/api/admin/delete`, {
        method: 'POST', // Asegúrate de que el backend sea POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: 'companies', id: parseInt(id) })
      });

      const result = await res.json();

      if (res.ok) {
        // Filtramos localmente para feedback instantáneo antes de recargar
        setCompanies(prev => prev.filter(c => c.id !== id));
        alert("Company deleted successfully");
      } else {
        alert("Error deleting: " + result.error);
      }
    } catch (err) {
      alert("Connection error when deleting");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Saving data...' });

    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('ticket_1', formData.ticket_1);
    dataToSend.append('sector', formData.sector);
    if (formData.ticket_2) dataToSend.append('ticket_2', formData.ticket_2);
    if (formData.ticket_3) dataToSend.append('ticket_3', formData.ticket_3);
    if (file) dataToSend.append('file', file);

    try {
      const response = await fetch('/api/admin/insert-with-file', {
        method: 'POST',
        body: dataToSend,
      });

      const result = await response.json();
      if (response.ok) {
        setStatus({ type: 'success', message: result.message });
        setFormData({ name: '', ticket_1: '', ticket_2: '', ticket_3: '', sector: 'Tankers' });
        setFile(null);
        e.target.reset();
        loadCompanies();
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px', color: COLORS.primary }}>Company Administration</h1>

      <form className='text-black' onSubmit={handleSubmit} style={formBox}>
        <div style={grid}>
          <input style={input} type="text" placeholder="Name" required 
                 onChange={e => setFormData({...formData, name: e.target.value})} value={formData.name} />
          
          <input style={input} type="text" placeholder="Ticker 1" required 
                 onChange={e => setFormData({...formData, ticket_1: e.target.value})} value={formData.ticket_1} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={label}>Sector</label>
          <select style={input} value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})}>
            <option value="Tankers">Tankers</option>
            <option value="DB">Dry Bulk</option>
          </select>
        </div>

        <div style={fileBox}>
          <label style={label}>Excel Model (Optional)</label>
          <input type="file" accept=".xlsx" onChange={e => setFile(e.target.files[0])} />
        </div>

        <button type="submit" style={btnPrimary}>Register Company</button>
        {status.message && <div style={statusMsg(status.type)}>{status.message}</div>}
      </form>

      <div style={{ marginTop: '50px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Database Records</h2>
        <div style={tableCard}>
          <table className='text-black' style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f4f4f4' }}>
                <th style={th}>Name</th>
                <th style={th}>Ticker</th>
                <th style={th}>File</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingList ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
              ) : companies.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={td}>{c.name}</td>
                  <td style={td}>{c.ticket_1}</td>
                  <td style={td}>{c.excel_path ? '✅' : '❌'}</td>
                  <td style={td}>
                    <button onClick={() => handleDelete(c.id)} style={btnDelete}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// STYLES
const formBox = { background: '#fff', padding: '25px', borderRadius: '10px', border: '1px solid #ddd' };
const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const input = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' };
const label = { display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' };
const btnPrimary = { width: '100%', padding: '12px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' };
const btnDelete = { padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };
const tableCard = { background: '#fff', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden' };
const th = { padding: '12px', textAlign: 'left', fontSize: '13px', borderBottom: '2px solid #eee' };
const td = { padding: '12px', fontSize: '13px' };
const fileBox = { marginBottom: '15px', padding: '15px', border: '1px dashed #ccc', borderRadius: '8px' };
const statusMsg = (type) => ({ marginTop: '15px', padding: '10px', borderRadius: '5px', textAlign: 'center', fontSize: '13px', 
    background: type === 'success' ? '#e6f4ea' : (type === 'loading' ? '#e8f0fe' : '#fce8e6'), 
    color: type === 'success' ? '#137333' : (type === 'loading' ? '#1967d2' : '#c5221f') });