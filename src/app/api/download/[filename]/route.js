import { readFile, access, readdir } from 'fs/promises';
import { constants } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

// Forzamos evaluación dinámica en cada petición
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    // 1. Resolver y decodificar el nombre de archivo
    const resolvedParams = await params;
    const rawFilename = resolvedParams?.filename;

    if (!rawFilename) {
      return NextResponse.json({ error: "Filename parameter is missing" }, { status: 400 });
    }

    const decodedFilename = decodeURIComponent(rawFilename);
    const safeFilename = decodedFilename.split(/[\\/]/).pop();

    if (!safeFilename || safeFilename.includes('..')) {
      return NextResponse.json({ error: "Invalid filename format" }, { status: 400 });
    }

    // 2. Comprobar la sesión activa del usuario
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Authentication required. Please sign in." }, { status: 401 });
    }

    // 3. Comprobar suscripción en PostgreSQL
    const userQuery = `
      SELECT u.id, u.premium, u.subscription_ends_at 
      FROM users u 
      JOIN sessions s ON u.id = s.user_id 
      WHERE s.session_token = $1
    `;
    const userRes = await query(userQuery, [token]);
    const user = userRes.rows?.[0];

    if (!user) {
      return NextResponse.json({ error: "Session invalid or expired. Please sign in again." }, { status: 401 });
    }

    const now = new Date();
    const isExpired = !user.subscription_ends_at || new Date(user.subscription_ends_at) < now;

    if (!user.premium || isExpired) {
      return NextResponse.json(
        { error: "An active subscription is required to download institutional financial models." },
        { status: 403 }
      );
    }

    // 4. Localizar el directorio y el archivo
    const storageDir = join(process.cwd(), 'private_storage', 'excel_models');
    const filePath = join(storageDir, safeFilename);

    try {
      // Verificamos si el archivo existe y es legible
      await access(filePath, constants.R_OK);
      const fileBuffer = await readFile(filePath);

      // Enviamos el archivo con las cabeceras de descarga
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${safeFilename}"`,
          'Cache-Control': 'no-store, max-age=0',
        },
      });

    } catch (fileError) {
      // DIAGNÓSTICO: Listamos los archivos existentes en la carpeta para identificar el problema
      let existingFiles = [];
      try {
        existingFiles = await readdir(storageDir);
      } catch (dirError) {
        existingFiles = ["Directory does not exist or cannot be read: " + dirError.message];
      }

      console.error("=== DIAGNÓSTICO DE DESCARGA ===");
      console.error("Archivo solicitado por el cliente:", safeFilename);
      console.error("Ruta completa buscada en disco:", filePath);
      console.error("Archivos encontrados en la carpeta:", existingFiles);
      console.error("================================");

      return NextResponse.json(
        { 
          error: "The requested Excel model was not found on the server.",
          requestedFile: safeFilename,
          availableFiles: existingFiles
        },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error("API Security / Download Error:", error);
    return NextResponse.json(
      { error: "Internal server error while processing the download." },
      { status: 500 }
    );
  }
}