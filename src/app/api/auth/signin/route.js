import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    // 1. Parseo seguro de los datos de entrada
    const body = await request.json().catch(() => null);

    if (!body || !body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // 2. Buscar usuario en la base de datos
    const userRes = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userRes.rows[0];

    // 3. Si el usuario no existe, salimos temprano
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 4. Comparar contraseña encriptada
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 5. Crear token de sesión y calcular expiración
    const sessionToken = Math.random().toString(36).substring(2) + Date.now();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 horas

    // Guardar sesión en la tabla sessions
    await query(
      'INSERT INTO sessions (user_id, session_token, expires) VALUES ($1, $2, $3)',
      [user.id, sessionToken, expires]
    );

    // 6. Configurar la cookie de sesión HTTP-only
    const cookieStore = await cookies();
    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
      sameSite: 'lax',
    });

    // 7. Determinar redirección según privilegios
    const redirectTo = user.super ? '/admin' : '/dashboard';

    return NextResponse.json(
      {
        message: "Authentication handshake successful",
        redirectTo: redirectTo,
      },
      { status: 200 }
    );
  } catch (error) {
    // Registro detallado en los logs de Railway para depuración
    console.error("Critical error in /api/auth/signin:", error);

    // Respuesta JSON garantizada para evitar errores de sintaxis en el cliente
    return NextResponse.json(
      { error: "Internal server error during authentication" },
      { status: 500 }
    );
  }
}