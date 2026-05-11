import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(request) {
  try {
    const { table, id, ids } = await request.json();

    // 1. Validación de tabla para evitar inyecciones SQL (añade tus tablas permitidas)
    const allowedTables = ['vsales', 'users', 'sessions'];
    if (!allowedTables.includes(table)) {
      return NextResponse.json({ error: "Tabla no permitida" }, { status: 400 });
    }

    // 2. Lógica de borrado múltiple o individual
    if (ids && Array.isArray(ids)) {
      // Borrado masivo usando ANY para mayor eficiencia
      await query(`DELETE FROM ${table} WHERE id = ANY($1::int[])`, [ids]);
      return NextResponse.json({ message: `${ids.length} registros eliminados` });
    } else if (id) {
      // Borrado individual (mantiene compatibilidad con el botón de siempre)
      await query(`DELETE FROM ${table} WHERE id = $1`, [id]);
      return NextResponse.json({ message: "Registro eliminado" });
    }

    return NextResponse.json({ error: "Faltan parámetros de ID" }, { status: 400 });

  } catch (error) {
    console.error("Error en DELETE API:", error);
    return NextResponse.json({ error: "Error de servidor al eliminar" }, { status: 500 });
  }
}
