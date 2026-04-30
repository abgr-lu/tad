"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function AdminTablePage() {
  const { table } = useParams();
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetch(`/api/admin/read?table=${table}`)
      .then(res => res.json())
      .then(json => setData(json));
  }, [table]);

  const handleInsert = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/insert', {
      method: 'POST',
      body: JSON.stringify({ table, data: formData })
    });
    if (res.ok) window.location.reload(); // Recarga para ver el nuevo registro
  };

  return (
    <div>
      <h1>Gestionar Tabla: {table.toUpperCase()}</h1>

      {/* FORMULARIO DINÁMICO (Ejemplo básico, puedes añadir más campos) */}
      <form onSubmit={handleInsert} style={{ background: '#f4f4f4', padding: '20px', marginBottom: '40px' }}>
        <h3>Añadir nuevo registro</h3>
        <input 
          placeholder="Nombre/Name" 
          onChange={e => setFormData({...formData, name: e.target.value})} 
        />
        <input 
          placeholder="Ticker 1" 
          onChange={e => setFormData({...formData, ticket_1: e.target.value})} 
        />
        {/* Aquí podrías mapear todos los campos de tu tabla companies */}
        <button type="submit">Guardar en {table}</button>
      </form>

      {/* LISTADO */}
      <table border="1" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name || item.title}</td>
              <td><button>Editar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
