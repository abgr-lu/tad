import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    // Añadimos 'mode' para que sea dinámico. Si no nos envían nada, por defecto será 'subscription'
    const { priceId, email, mode = 'subscription' } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Se requiere el ID del precio' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: mode, // Ahora usa el modo que le pasemos desde el frontend (payment o subscription)
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/setup-account?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error('Error al crear la sesión de Stripe:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}