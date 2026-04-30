import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  // Verificar Super Admin
  const userRes = await query(
    'SELECT u.super FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.session_token = $1',
    [token]
  );

  if (!userRes.rows[0]?.super) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { table, id, data } = await request.json();

  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    // Construir el SET: "col1"=$1, "col2"=$2...
    const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
    const sql = `UPDATE "${table}" SET ${setClause} WHERE id = $${keys.length + 1}`;
    
    await query(sql, [...values, id]);
    return NextResponse.json({ message: "Actualizado con éxito" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}
