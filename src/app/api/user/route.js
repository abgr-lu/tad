import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) {
    return NextResponse.json({ error: "No hay sesión" }, { status: 401 });
  }

  // AÑADIMOS: u.country y u.image a la consulta
  const res = await query(
    `SELECT u.name, u.email, u.country, u.image 
     FROM users u 
     JOIN sessions s ON u.id = s.user_id 
     WHERE s.session_token = $1`,
    [token]
  );

  if (res.rows.length === 0) {
    return NextResponse.json({ error: "Sesión inválida" }, { status: 401 });
  }

  // Devolvemos el primer usuario (objeto), no el array completo
  return NextResponse.json(res.rows[0]);
}
