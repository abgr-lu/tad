import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let table = searchParams.get('table');
  
  // Parámetros de paginación y búsqueda
  const limit = parseInt(searchParams.get('limit')) || 50;
  const offset = parseInt(searchParams.get('offset')) || 0;
  const search = searchParams.get('search') || "";

  // Mapeo: si la URL es /admin/vvalues, buscamos en la tabla 'vv'
  if (table === 'vvalues') table = 'vv';

  try {
    let sql = "";
    let values = [];

    // Lógica específica para vsales (Búsqueda y Paginación)
    if (table === 'vsales') {
      // Usamos ILIKE para búsqueda insensible a mayúsculas
      // sector::text asegura que si es un tipo ENUM, se pueda comparar con el string de búsqueda
      sql = `
        SELECT * FROM "vsales" 
        WHERE (name ILIKE $1 OR sector::text ILIKE $1)
        ORDER BY year_r DESC, week DESC, id DESC
        LIMIT $2 OFFSET $3
      `;
      values = [`%${search}%`, limit, offset];
    } else {
      // Para el resto de tablas, mantenemos la carga estándar pero con orden descendente
      sql = `SELECT * FROM "${table}" ORDER BY id DESC LIMIT $1 OFFSET $2`;
      values = [limit, offset];
    }

    const res = await query(sql, values);
    return NextResponse.json(res.rows);

  } catch (e) {
    console.error("ERROR EN READ API:", e);
    // Devolvemos [] para evitar que .map() falle en el frontend
    return NextResponse.json([]); 
  }
}