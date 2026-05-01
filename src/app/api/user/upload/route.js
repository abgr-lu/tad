import { writeFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  const data = await request.formData();
  const file = data.get('file');

  if (!file || !token) return NextResponse.json({ error: "Error" }, { status: 400 });

  if (file.size > 4 * 1024 * 1024) {
  return NextResponse.json({ error: "La imagen supera los 4MB" }, { status: 400 });
}

  // 1. Convertir archivo a Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 2. Crear nombre único para evitar duplicados
  const fileName = `${Date.now()}-${file.name}`;
  const path = join(process.cwd(), 'public/uploads', fileName);

  // 3. Guardar en el sistema de archivos
  await writeFile(path, buffer);
  const imageUrl = `/uploads/${fileName}`;

  // 4. Actualizar base de datos
  await query(
    `UPDATE users SET image = $1 FROM sessions 
     WHERE users.id = sessions.user_id AND sessions.session_token = $2`,
    [imageUrl, token]
  );

  return NextResponse.json({ imageUrl });
}
