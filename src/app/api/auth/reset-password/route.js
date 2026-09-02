import { NextResponse } from 'next/server';
import { query as db } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos (token o contraseña)' },
        { status: 400 }
      );
    }

    // 1. Buscar el token en la base de datos y comprobar que no haya caducado
    // La función NOW() de PostgreSQL nos da la fecha y hora actuales
    const tokenResult = await db(
      'SELECT email FROM password_resets WHERE token = $1 AND expires_at > NOW()',
      [token]
    );

    if (tokenResult.rows.length === 0) {
      // Si no hay resultados, el token no existe o ya caducó
      return NextResponse.json(
        { error: 'El enlace de recuperación es inválido o ha caducado.' },
        { status: 400 }
      );
    }

    const email = tokenResult.rows[0].email;

    // 2. Encriptar la nueva contraseña con bcrypt
    // El número 10 es el "salt rounds", el estándar recomendado para seguridad y rendimiento
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Actualizar la contraseña en la tabla users
    await db(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, email]
    );

    // 4. Eliminar los tokens asociados a este email para evitar usos futuros (limpieza)
    await db(
      'DELETE FROM password_resets WHERE email = $1',
      [email]
    );

    return NextResponse.json(
      { message: 'Contraseña actualizada con éxito' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en reset-password API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}