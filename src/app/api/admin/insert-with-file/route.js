import { query } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const formData = await request.formData();

    // 1. Extraer datos y archivo del formulario
    const file = formData.get('file');
    const name = formData.get('name');
    const ticket_1 = formData.get('ticket_1');
    const ticket_2 = formData.get('ticket_2');
    const ticket_3 = formData.get('ticket_3');
    const sector = formData.get('sector');

    // Validación del campo obligatorio
    if (!name) {
      return NextResponse.json({ error: "Nombre es obligatorio" }, { status: 400 });
    }

    let fileName = null;

    // 2. Procesar y guardar el archivo Excel manteniendo su nombre intacto
    if (file && typeof file !== 'string' && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Mantenemos el nombre original exacto del archivo para no romper los vínculos de Excel
      fileName = file.name;

      // Ruta de almacenamiento privado en el servidor
      const uploadDir = join(process.cwd(), 'private_storage', 'excel_models');
      const targetFilePath = join(uploadDir, fileName);

      // Aseguramos que la carpeta exista
      await mkdir(uploadDir, { recursive: true });

      // writeFile sobrescribe automáticamente el archivo si ya existe uno con el mismo nombre
      await writeFile(targetFilePath, buffer);
    }

    // 3. Registrar la compañía en PostgreSQL con el nombre exacto del archivo
    const sql = `
      INSERT INTO companies (name, ticket_1, ticket_2, ticket_3, sector, excel_path) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id
    `;

    const result = await query(sql, [
      name,
      ticket_1 || null,
      ticket_2 || null,
      ticket_3 || null,
      sector || 'Tankers',
      fileName
    ]);

    return NextResponse.json({
      message: fileName
        ? "Compañía y modelo guardados correctamente (archivo sobrescrito si existía)"
        : "Compañía guardada correctamente (sin archivo)",
      id: result.rows[0].id,
      fileName: fileName
    }, { status: 200 });

  } catch (error) {
    console.error("ERROR EN API INSERT-WITH-FILE:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud: " + error.message },
      { status: 500 }
    );
  }
}