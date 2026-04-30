// app/admin/page.js
export default function AdminPage() {
  return (
    <div>
      <h1>Panel de Control de Super Admin</h1>
      <p>Selecciona una tabla en el menú lateral para empezar a gestionar los datos.</p>
      
      <div style={{ marginTop: '20px', display: 'grid', gap: '10px' }}>
        <a href="/admin/companies">➡️ Gestionar Companies</a>
        <a href="/admin/ob">➡️ Gestionar OB</a>
        <a href="/admin/shorts">➡️ Gestionar Shorts</a>
        <a href="/admin/vvalues">➡️ Gestionar V-Values</a>
      </div>
    </div>
  );
}
