import { NextResponse } from 'next/server';
import { query as db } from '@/lib/db';

export async function POST(req) {
  try {
    const { email } = await req.json();

    // Buscamos si el usuario ya está en la base de datos
    const userResult = await db('SELECT id FROM users WHERE email = $1', [email]);
    
    // Devolvemos 'true' si existe, 'false' si es nuevo
    const exists = userResult.rows.length > 0;
    
    return NextResponse.json({ exists }, { status: 200 });
  } catch (error) {
    console.error('Error al comprobar email:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}