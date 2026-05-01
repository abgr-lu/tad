import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  const { subject, message } = await request.json();

  // Obtener datos del usuario para saber quién escribe
  const userRes = await query(
    `SELECT u.name, u.email FROM users u 
     JOIN sessions s ON u.id = s.user_id 
     WHERE s.session_token = $1`, [token]
  );

  const user = userRes.rows[0];

  // LOG de simulación (Aquí iría el envío de mail real)
  console.log(`📩 NUEVO TICKET DE SOPORTE:
    Usuario: ${user.name} (${user.email})
    Asunto: ${subject}
    Mensaje: ${message}`);

  return NextResponse.json({ message: "Mensaje enviado con éxito" });
}
