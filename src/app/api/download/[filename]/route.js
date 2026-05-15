import { readFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  // 1. SOLUCIÓN AL ERROR: Esperar a que los parámetros se resuelvan
  const resolvedParams = await params;
  const { filename } = resolvedParams;

  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  try {
    // 2. Verificar sesión del usuario
    const userRes = await query(
      'SELECT u.id FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.session_token = $1',
      [token]
    );

    if (!userRes.rows[0]) {
      return NextResponse.json({ error: "No autorizado. Inicia sesión." }, { status: 401 });
    }

    // 3. Construir la ruta al almacenamiento privado
    // Asegúrate de que la carpeta 'private_storage/excel_models' exista en la raíz de tu proyecto
    const filePath = join(process.cwd(), 'private_storage', 'excel_models', filename);
    
    const file = await readFile(filePath);

    // 4. Retornar el archivo para descarga
    return new NextResponse(file, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });

  } catch (error) {
    console.error("Error en la descarga:", error);
    // Si llega aquí, es probable que el archivo no exista en el disco
    return NextResponse.json({ error: "Archivo no encontrado en el servidor" }, { status: 404 });
  }
}