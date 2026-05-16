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
    const sector = formData.get('sector'); // Recuperamos el sector

    // VALIDACIÓN: Ahora solo el NOMBRE es obligatorio para el backend
    if (!name || !ticket_1) {
      return NextResponse.json({ error: "Nombre y Ticker 1 son obligatorios" }, { status: 400 });
    }

    let fileName = null;

    // 1. Guardar el archivo físicamente SOLO SI existe
    if (file && typeof file !== 'string' && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const uploadDir = join(process.cwd(), 'private_storage', 'excel_models');
      
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, fileName), buffer);
    }

    // 2. Insertar en la Base de Datos (Incluyendo SECTOR y permitiendo excel_path nulo)
    const sql = `
      INSERT INTO companies (name, ticket_1, ticket_2, ticket_3, sector, excel_path) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id
    `;
    
    const result = await query(sql, [
      name, 
      ticket_1, 
      ticket_2 || null, 
      ticket_3 || null, 
      sector || 'Tankers', 
      fileName
    ]);

    return NextResponse.json({ 
      message: fileName 
        ? "Compañía y modelo guardados correctamente" 
        : "Compañía guardada correctamente (sin archivo)", 
      id: result.rows[0].id 
    });

  } catch (error) {
    console.error("ERROR EN API INSERT-WITH-FILE:", error);
    return NextResponse.json({ error: "Error al procesar la solicitud: " + error.message }, { status: 500 });
  }
}