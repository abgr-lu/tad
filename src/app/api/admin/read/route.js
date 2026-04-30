import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let table = searchParams.get('table');

  // Mapeo: si la URL es /admin/vvalues, buscamos en la tabla 'vv'
  if (table === 'vvalues') table = 'vv';

  try {
    // Usamos comillas dobles "" para el nombre de la tabla
    const res = await query(`SELECT * FROM "${table}" ORDER BY id DESC`);
    return NextResponse.json(res.rows);
  } catch (e) {
    console.error("ERROR EN READ API:", e);
    // Devolvemos un array vacío [] para que el .map del frontend no rompa
    return NextResponse.json([]); 
  }
}
