import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Límite de seguridad de 2MB
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "The file exceeds 2MB limit" }, { status: 400 });
    }

    // 1. Convertir el archivo recibido a Buffer en memoria
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Convertir el Buffer a formato Data URL en Base64
    // Ejemplo: data:image/jpeg;base64,/9j/4AAQSkZJRg...
    const mimeType = file.type || 'image/jpeg';
    const base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;

    // 3. Actualizar la base de datos directamente
    await query(
      `UPDATE users SET image = $1 FROM sessions 
       WHERE users.id = sessions.user_id AND sessions.session_token = $2`,
      [base64Image, token]
    );

    // 4. Retornar la cadena Base64 como URL de la imagen
    return NextResponse.json({ imageUrl: base64Image }, { status: 200 });

  } catch (error) {
    console.error("Error al procesar la subida del avatar:", error);
    return NextResponse.json({ error: "Internal server error during upload" }, { status: 500 });
  }
}
