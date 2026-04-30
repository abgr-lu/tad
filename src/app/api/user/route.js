import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  // En Next.js 15, cookies() es asíncrono
  const cookieStore = await cookies(); 
  const token = cookieStore.get('session_token')?.value;

  if (!token) {
    return NextResponse.json({ error: "No hay sesión" }, { status: 401 });
  }

  const res = await query(
    `SELECT u.id, u.name, u.email, u.super 
   FROM users u 
   JOIN sessions s ON u.id = s.user_id 
   WHERE s.session_token = $1`,
  [token]
  );

  if (res.rows.length === 0) {
    return NextResponse.json({ error: "Sesión inválida" }, { status: 401 });
  }

  // Devolvemos el primer usuario encontrado
  return NextResponse.json(res.rows[0]);
}
