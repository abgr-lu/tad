// src/app/api/admin/delete/route.js
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { table, id } = await request.json();

    if (!table || !id) {
      return NextResponse.json({ error: "Faltan parámetros (table o id)" }, { status: 400 });
    }

    // Usamos comillas dobles para el nombre de la tabla por si tiene mayúsculas
    const sql = `DELETE FROM "${table}" WHERE id = $1 RETURNING *`;
    const res = await query(sql, [id]);

    if (res.rowCount === 0) {
      return NextResponse.json({ error: "No se encontró el registro" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Registro eliminado correctamente" });

  } catch (error) {
    console.error("DELETE API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}