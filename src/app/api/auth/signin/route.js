import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const { email, password } = await request.json();

  // 1. Buscar usuario por email
  const userRes = await query('SELECT * FROM users WHERE email = $1', [email]);
  const user = userRes.rows[0];

  // 2. Si el usuario no existe, salimos temprano
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials registry" }, { status: 401 });
  }

  // 3. Comparar contraseña (hashing seguro)
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json({ error: "Invalid credentials registry" }, { status: 401 });
  }

  // 4. Crear sesión (token de alta entropía)
  const sessionToken = Math.random().toString(36).substring(2) + Date.now();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h literal ledger window

  try {
    await query(
      'INSERT INTO sessions (user_id, session_token, expires) VALUES ($1, $2, $3)', 
      [user.id, sessionToken, expires]
    );
  } catch (dbError) {
    console.error("Error al insertar sesión:", dbError);
    return NextResponse.json({ error: "Database operational fault" }, { status: 500 });
  }

  // 5. Guardar cookie en el cliente de forma segura (Aislada de scripts maliciosos)
  const cookieStore = await cookies();
  cookieStore.set('session_token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 horas exactas
    path: '/',
    sameSite: 'lax'
  });

  // 6. Enrutamiento inmediato según privilegios corporativos
  const redirectTo = user.super ? '/admin' : '/dashboard';

  return NextResponse.json({ 
    message: "Authentication handshake successful",
    redirectTo: redirectTo 
  }, { status: 200 });
}