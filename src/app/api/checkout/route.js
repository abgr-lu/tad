import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query as db } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { priceId, email, mode = 'subscription' } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Se requiere el ID del precio' }, { status: 400 });
    }

    // Verificamos si el usuario ya existe en nuestra base de datos
    const userCheck = await db('SELECT id FROM users WHERE email = $1', [email]);
    const isExistingUser = userCheck.rows.length > 0;

    // Redirección inteligente post-pago
    let successUrl;
    if (isExistingUser) {
      // Renovación: Ruta invisible para actualizar cuenta
      successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/renew-success?session_id={CHECKOUT_SESSION_ID}`;
    } else {
      // Nuevo usuario: Pantalla para crear contraseña
      successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/setup-account?session_id={CHECKOUT_SESSION_ID}`;
    }

    const session = await stripe.checkout.sessions.create({
      mode: mode,
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error('Error al crear la sesión de Stripe:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}