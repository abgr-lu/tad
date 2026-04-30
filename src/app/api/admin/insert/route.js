import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  // 1. Verificar que es Super Admin
  const userRes = await query(
    'SELECT u.super FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.session_token = $1',
    [token]
  );

  // IMPORTANTE: userRes.rows[0] es la forma correcta de acceder al primer registro
  if (!userRes.rows[0]?.super) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { table, data } = await request.json();

  try {
    const keys = Object.keys(data);
    const values = Object.values(data);

    // 2. ESCAPADO DE COLUMNAS (Crucial para nombres como "5", "10", etc.)
    // Ponemos cada columna entre comillas dobles: "sector", "5", "10"...
    const cols = keys.map(k => `"${k}"`).join(', ');
    
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    // 3. ESCAPADO DE LA TABLA
    const sql = `INSERT INTO "${table}" (${cols}) VALUES (${placeholders})`;
    
    await query(sql, values);

    return NextResponse.json({ message: "Datos insertados correctamente" });
  } catch (error) {
    console.error("ERROR EN INSERT:", error);
    return NextResponse.json({ error: "Error en la base de datos" }, { status: 500 });
  }
}
