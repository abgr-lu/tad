import { readFile, access } from 'fs/promises';
import { constants } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    // 1. Resolvemos parámetros
    const resolvedParams = await params;
    const { filename } = resolvedParams;

    // 2. SEGURIDAD: Verificación de sesión mediante cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return new Response("Unauthorized: No session token found", { status: 401 });
    }

    // Consultamos si el token pertenece a un usuario válido
    const userRes = await query(
      'SELECT u.id FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.session_token = $1',
      [token]
    );

    if (!userRes.rows || userRes.rows.length === 0) {
      return new Response("Unauthorized: Invalid session", { status: 401 });
    }

    // 3. CONSTRUCCIÓN SEGURA DE RUTA
    // Evitamos "Path Traversal" asegurándonos de que el nombre de archivo sea solo el nombre
    const safeFilename = filename.split(/[\\/]/).pop(); 
    const filePath = join(process.cwd(), 'private_storage', 'excel_models', safeFilename);

    // 4. ACCESO AL ARCHIVO
    try {
      await access(filePath, constants.R_OK);
      const fileBuffer = await readFile(filePath);
      
      // 5. RESPUESTA PROTEGIDA
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${safeFilename}"`,
          'Cache-Control': 'no-store, max-age=0', // Evita que navegadores públicos cacheen el Excel
        },
      });
    } catch (err) {
      console.error("File not found on disk:", safeFilename);
      return new Response("Resource not found", { status: 404 });
    }

  } catch (error) {
    console.error("API Security Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}