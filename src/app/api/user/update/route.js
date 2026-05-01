import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { name, country, image } = await request.json();

  try {
    // Buscamos al usuario dueño de la sesión actual
    await query(
      `UPDATE users SET name = $1, country = $2, image = $3 
       FROM sessions 
       WHERE users.id = sessions.user_id AND sessions.session_token = $4`,
      [name, country, image, token]
    );
    return NextResponse.json({ message: "Perfil actualizado" });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}
