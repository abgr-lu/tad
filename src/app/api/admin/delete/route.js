import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(request) {
  try {
    let { table, id, ids } = await request.json();

    // 1. Mapeo de nombres de tablas (para mantener consistencia con el resto del proyecto)
    if (table === 'vvalues') table = 'vv';

    // 2. Validación de tabla (Lista blanca de seguridad)
    // Añadimos 'shorts', 'vv' y 'ob' a las tablas permitidas
    const allowedTables = ['vsales', 'vv', 'shorts', 'ob', 'users', 'sessions'];
    
    if (!allowedTables.includes(table)) {
      return NextResponse.json({ error: "Acceso denegado a la tabla" }, { status: 403 });
    }

    // 3. Lógica de borrado múltiple
    if (ids && Array.isArray(ids) && ids.length > 0) {
      // Usamos ANY($1::int[]) para eliminar todos los IDs en una sola consulta
      await query(`DELETE FROM "${table}" WHERE id = ANY($1::int[])`, [ids]);
      return NextResponse.json({ 
        success: true, 
        message: `${ids.length} registros eliminados correctamente.` 
      });
    } 
    
    // 4. Lógica de borrado individual (el botón de la papelera)
    if (id) {
      await query(`DELETE FROM "${table}" WHERE id = $1`, [id]);
      return NextResponse.json({ 
        success: true, 
        message: "Registro eliminado correctamente." 
      });
    }

    return NextResponse.json({ error: "No se proporcionó un ID válido" }, { status: 400 });

  } catch (error) {
    console.error("ERROR EN DELETE API:", error);
    return NextResponse.json({ 
      error: "Error interno al intentar eliminar el registro",
      details: error.message 
    }, { status: 500 });
  }
}