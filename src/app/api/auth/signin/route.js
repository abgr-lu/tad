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
    console.log("Usuario no encontrado");
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  // 3. Comparar contraseña (solo una vez)
  const isMatch = await bcrypt.compare(password, user.password);
  console.log("¿La contraseña coincide?:", isMatch);

  if (!isMatch) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  // 4. Crear sesión (token aleatorio)
  const sessionToken = Math.random().toString(36).substring(2) + Date.now();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

  try {
    await query(
      'INSERT INTO sessions (user_id, session_token, expires) VALUES ($1, $2, $3)', 
      [user.id, sessionToken, expires]
    );
  } catch (dbError) {
    console.error("Error al insertar sesión:", dbError);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }

  // 5. Guardar cookie
  const cookieStore = await cookies(); // En algunas versiones de Next.js es mejor instanciarlo
  cookieStore.set('session_token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 horas
    path: '/',
  });

  return NextResponse.json({ message: "Login exitoso" });
}
