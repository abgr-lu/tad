import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { rows } = await request.json();

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "No hay datos para procesar" }, { status: 400 });
    }

    for (const row of rows) {
      // Validamos que la fila no esté vacía (nombre es obligatorio)
      if (!row.name) continue;

      await query(
        `INSERT INTO vsales (sector, type, name, dwt, year_b, yard, country, buyer, price, scrubber, comments, year_r, week, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          row.sector || "",
          row.type || "",
          row.name,
          parseInt(row.dwt) || 0,
          parseInt(row.year_b) || 2000,
          row.yard || "",
          row.country || "",
          row.buyer || "",
          parseFloat(row.price) || 0,
          row.scrubber === 'true' || row.scrubber === true,
          row.comments || "",
          parseInt(row.year_r) || new Date().getFullYear(),
          parseInt(row.week) || 1,
          row.status || "Reported"
        ]
      );
    }

    return NextResponse.json({ message: `${rows.length} registros importados correctamente` });
  } catch (error) {
    console.error("Error en importación CSV:", error);
    return NextResponse.json({ error: "Error interno al insertar los datos" }, { status: 500 });
  }
}
