import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let table = searchParams.get('table');
  
  // Pagination and search parameters
  const limit = parseInt(searchParams.get('limit')) || 50;
  const offset = parseInt(searchParams.get('offset')) || 0;
  const search = searchParams.get('search') || "";

  // Table mapping (vvalues -> vv)
  if (table === 'vvalues') table = 'vv';

  try {
    let sql = "";
    let values = [];
    const searchTerm = `%${search}%`;

    // 1. SPECIFIC LOGIC FOR VSALES (Detailed Global Search)
    if (table === 'vsales') {
      sql = `
        SELECT * FROM "vsales" 
        WHERE (
          name ILIKE $1 OR 
          type ILIKE $1 OR 
          buyer ILIKE $1 OR 
          yard ILIKE $1 OR 
          country ILIKE $1 OR 
          sector::text ILIKE $1
        )
        ORDER BY year_r DESC, week DESC, id DESC
        LIMIT $2 OFFSET $3
      `;
      values = [searchTerm, limit, offset];
    } 
    
    // 2. SEARCH LOGIC FOR SHORTS
    else if (table === 'shorts') {
      sql = `
        SELECT * FROM "shorts"
        WHERE (symbol ILIKE $1 OR company ILIKE $1)
        ORDER BY id DESC
        LIMIT $2 OFFSET $3
      `;
      values = [searchTerm, limit, offset];
    }

    // 3. SEARCH LOGIC FOR VV AND OB
    else if (table === 'vv' || table === 'ob') {
      sql = `
        SELECT * FROM "${table}"
        WHERE (type ILIKE $1 OR sector::text ILIKE $1)
        ORDER BY id DESC
        LIMIT $2 OFFSET $3
      `;
      values = [searchTerm, limit, offset];
    }

    // 4. FALLBACK FOR ANY OTHER TABLE
    else {
      sql = `SELECT * FROM "${table}" ORDER BY id DESC LIMIT $1 OFFSET $2`;
      values = [limit, offset];
    }

    const res = await query(sql, values);
    return NextResponse.json(res.rows);

  } catch (e) {
    console.error("READ API ERROR:", e);
    // Return empty array to prevent frontend crashes on .map()
    return NextResponse.json([]); 
  }
}