import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    // 1. Extraer la cookie usando el método nativo oficial e infalible de Next.js
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('session_token');

    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.json({ error: "No session token found in context" }, { status: 401 });
    }

    const tokenValue = tokenCookie.value;

    // 2. JOIN relacional directo para comprobar la validez de la sesión
    const sessionRes = await query(
      `SELECT s.expires, u.super, u.premium, u.subscription_ends_at 
       FROM sessions s
       INNER JOIN users u ON s.user_id = u.id
       WHERE s.session_token = $1`,
      [tokenValue]
    );

    if (sessionRes.rows.length === 0) {
      return NextResponse.json({ error: "Active session ledger not found" }, { status: 401 });
    }

    const sessionData = sessionRes.rows[0];

    // 3. Control de seguridad básico: ¿Ha expirado la sesión?
    if (new Date() > new Date(sessionData.expires)) {
      return NextResponse.json({ error: "Session lifetime expired" }, { status: 401 });
    }

    // 4. Comprobación matemática estricta de la ventana temporal de Stripe
    const hasNotExpired = sessionData.subscription_ends_at 
      ? new Date() < new Date(sessionData.subscription_ends_at) 
      : false;

    // Retornamos las respuestas limpias
    return NextResponse.json({
      super: sessionData.super || false,
      premium: sessionData.premium || false,
      valid: hasNotExpired
    }, { status: 200 });

  } catch (error) {
    console.error("Critical error inside verify-subscription sentinel:", error);
    return NextResponse.json({ error: "Internal operational failure" }, { status: 500 });
  }
}