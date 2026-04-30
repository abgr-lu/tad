import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (token) {
    await query('DELETE FROM sessions WHERE session_token = $1', [token]);
    cookieStore.delete('session_token');
  }
  
  return NextResponse.json({ message: "Sesión cerrada" });
}
