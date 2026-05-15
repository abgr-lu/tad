import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request) {
  try {
    const { table, data } = await request.json();

    if (!table || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "Datos inválidos o vacíos" }, { status: 400 });
    }

    // --- CORRECCIÓN DE SEGURIDAD AQUÍ ---
    // Solo filtramos por 'sector' si la tabla NO es 'shorts'
    const cleanData = data.filter(item => {
      if (table === "shorts") {
        // En shorts, validamos que al menos exista el símbolo
        return item.symbol && item.symbol.trim() !== "";
      }
      // En las demás, validamos que exista el sector (ENUM)
      return item.sector && item.sector.trim() !== "";
    });

    if (cleanData.length === 0) {
      return NextResponse.json({ 
        error: "No hay registros válidos. Revisa las columnas del CSV." 
      }, { status: 400 });
    }

    let columns = "";
    let conflictTarget = "";
    let updateSet = "";
    let placeholdersPerRow = 0;

    if (table === "shorts") {
      columns = "company, symbol, market, current_short, previous_short, outstanding, float, av_vol, date";
      conflictTarget = "(symbol, date)";
      updateSet = "current_short=EXCLUDED.current_short, previous_short=EXCLUDED.previous_short, outstanding=EXCLUDED.outstanding, float=EXCLUDED.float, av_vol=EXCLUDED.av_vol, company=EXCLUDED.company, market=EXCLUDED.market";
      placeholdersPerRow = 9;
    } 
    else if (table === "vv") {
      columns = 'sector, type, nb, "5", "10", "15", "20", scrap, year, week';
      conflictTarget = "(type, year, week)";
      updateSet = 'nb=EXCLUDED.nb, "5"=EXCLUDED."5", "10"=EXCLUDED."10", "15"=EXCLUDED."15", "20"=EXCLUDED."20", scrap=EXCLUDED.scrap, sector=EXCLUDED.sector';
      placeholdersPerRow = 10;
    }
    else if (table === "ob") {
      columns = 'sector, type, "2025", "2026", "2027", "2028", beyond';
      conflictTarget = "(sector, type)";
      updateSet = '"2025"=EXCLUDED."2025", "2026"=EXCLUDED."2026", "2027"=EXCLUDED."2027", "2028"=EXCLUDED."2028", beyond=EXCLUDED.beyond';
      placeholdersPerRow = 7;
    }
    else if (table === "vsales") {
      columns = "sector, type, name, dwt, year_b, yard, country, buyer, price, scrubber, comments, year_r, week, status";
      conflictTarget = "(name, year_r, week)";
      updateSet = "sector=EXCLUDED.sector, type=EXCLUDED.type, dwt=EXCLUDED.dwt, year_b=EXCLUDED.year_b, yard=EXCLUDED.yard, country=EXCLUDED.country, buyer=EXCLUDED.buyer, price=EXCLUDED.price, scrubber=EXCLUDED.scrubber, comments=EXCLUDED.comments, status=EXCLUDED.status";
      placeholdersPerRow = 14;
    } else {
      return NextResponse.json({ error: "Tabla no permitida" }, { status: 403 });
    }

    const values = [];
    const rowsSql = cleanData.map((item, rowIndex) => {
      const offset = rowIndex * placeholdersPerRow;
      
      if (table === "shorts") {
        values.push(item.company, item.symbol, item.market, item.current_short, item.previous_short, item.outstanding, item.float, item.av_vol, item.date);
      } else if (table === "vv") {
        values.push(item.sector, item.type, item.nb, item["5"], item["10"], item["15"], item["20"], item.scrap, item.year, item.week);
      } else if (table === "ob") {
        values.push(item.sector, item.type, item["2025"], item["2026"], item["2027"], item["2028"], item.beyond);
      } else if (table === "vsales") {
        values.push(item.sector, item.type, item.name, item.dwt, item.year_b, item.yard, item.country, item.buyer, item.price, item.scrubber, item.comments, item.year_r, item.week, item.status);
      }

      const placeholders = Array.from({ length: placeholdersPerRow }, (_, i) => `$${offset + i + 1}`).join(", ");
      return `(${placeholders})`;
    }).join(", ");

    const sql = `INSERT INTO ${table} (${columns}) VALUES ${rowsSql} ON CONFLICT ${conflictTarget} DO UPDATE SET ${updateSet};`;

    await query(sql, values);
    return NextResponse.json({ success: true, message: `Procesados ${cleanData.length} registros en ${table}` });

  } catch (error) {
    console.error("Error en bulk-insert:", error);
    return NextResponse.json({ error: "Error de servidor", details: error.message }, { status: 500 });
  }
}