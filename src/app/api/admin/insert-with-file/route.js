import { query } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extraer archivo y datos
    const file = formData.get('file');
    const name = formData.get('name');
    const ticket_1 = formData.get('ticket_1');
    const ticket_2 = formData.get('ticket_2');
    const ticket_3 = formData.get('ticket_3');

    if (!file || !name) {
      return NextResponse.json({ error: "Nombre y archivo son obligatorios" }, { status: 400 });
    }

    // 1. Guardar el archivo físicamente
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const uploadDir = join(process.cwd(), 'private_storage', 'excel_models');
    
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, fileName), buffer);

    // 2. Insertar en la Base de Datos con la ruta del archivo
    const sql = `
      INSERT INTO companies (name, ticket_1, ticket_2, ticket_3, excel_path) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id
    `;
    
    const result = await query(sql, [name, ticket_1, ticket_2, ticket_3, fileName]);

    return NextResponse.json({ 
      message: "Compañía y modelo guardados correctamente", 
      id: result.rows[0].id 
    });

  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });
  }
}