import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  // 1. Verificar Super Admin
  const userRes = await query(
    'SELECT u.super FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.session_token = $1',
    [token]
  );

  if (!userRes.rows[0]?.super) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { table, id } = await request.json();

  try {
    // 2. Ejecutar el borrado
    await query(`DELETE FROM "${table}" WHERE id = $1`, [id]);
    return NextResponse.json({ message: "Registro eliminado" });
  } catch (error) {
    console.error("ERROR EN DELETE:", error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
