import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function PUT(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { currentPassword, newPassword } = await request.json();

  try {
    // 1. Obtener el usuario actual
    const res = await query(
      `SELECT u.id, u.password FROM users u 
       JOIN sessions s ON u.id = s.user_id 
       WHERE s.session_token = $1`,
      [token]
    );

    const user = res.rows[0];

    // 2. Verificar que la contraseña actual es correcta
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "La contraseña actual es incorrecta" }, { status: 400 });
    }

    // 3. Encriptar y guardar la nueva contraseña
    const hashedParams = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET password = $1 WHERE id = $2', [hashedParams, user.id]);

    return NextResponse.json({ message: "Contraseña actualizada" });
  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
