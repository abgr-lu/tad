import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query as db } from '@/lib/db';
import bcrypt from 'bcrypt';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { sessionId, password } = await req.json();

    if (!sessionId || !password) {
      return NextResponse.json({ error: 'Faltan datos de seguridad' }, { status: 400 });
    }

    // 1. Le pedimos a Stripe los detalles del pago, expandiendo 'line_items' para ver qué compró
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });
    
    if (!session || session.payment_status !== 'paid') {
       return NextResponse.json({ error: 'El pago no es válido o no está completado.' }, { status: 400 });
    }

    const email = session.customer_details.email;
    let name = session.customer_details.name;
    if (!name) {
      name = email.split('@')[0]; 
    }

    const existingUser = await db('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
       return NextResponse.json({ error: 'Este correo ya tiene una cuenta activa.' }, { status: 400 });
    }

    // 2. Extraemos el ID del precio que acaba de pagar
    const priceId = session.line_items.data[0].price.id;

    // 3. Calculamos la fecha de caducidad en base al plan elegido
    const now = new Date();
    let endsAt = new Date();

    if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL) {
      endsAt.setFullYear(now.getFullYear() + 1); // Suma 1 año
    } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_NEW_USER) {
      endsAt.setMonth(now.getMonth() + 6); // Suma 6 meses
    } else {
      endsAt.setMonth(now.getMonth() + 1); // Por defecto (Mensual), suma 1 mes
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Guardamos al usuario con sus privilegios premium y fecha de caducidad
    await db(
      'INSERT INTO users (email, password, name, premium, subscription_ends_at) VALUES ($1, $2, $3, $4, $5)',
      [email, hashedPassword, name, true, endsAt.toISOString()]
    );

    return NextResponse.json({ message: 'Cuenta creada con éxito' }, { status: 200 });

  } catch (error) {
    console.error('Error al configurar la cuenta:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}