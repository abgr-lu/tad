import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query as db } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Esta es la variable que configuraremos en el siguiente paso
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  // 1. Stripe nos envía los datos en texto plano y una firma de seguridad
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;

  try {
    // 2. Verificamos matemáticamente que el mensaje viene de Stripe y no de un hacker
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err) {
    console.error('⚠️ Error de seguridad en Webhook:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // 3. Escuchamos específicamente cuando un cobro recurrente ha tenido éxito
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object;
    
    const email = invoice.customer_email;
    
    // Stripe nos da la nueva fecha de fin de periodo en "segundos" (timestamp).
    // Lo multiplicamos por 1000 para convertirlo a milisegundos que usa JavaScript.
    const newEndDateTimestamp = invoice.lines.data[0].period.end * 1000;
    const newEndDate = new Date(newEndDateTimestamp).toISOString();

    if (email) {
      try {
        // Actualizamos la base de datos extendiendo la fecha y asegurando el acceso premium
        await db(
          'UPDATE users SET premium = true, subscription_ends_at = $1 WHERE email = $2',
          [newEndDate, email]
        );
        console.log(`✅ Suscripción renovada para ${email} hasta ${newEndDate}`);
      } catch (dbError) {
        console.error('Error al actualizar la base de datos:', dbError);
      }
    }
  }

  // 4. Siempre debemos responder con un status 200 rápido para que Stripe sepa que lo recibimos
  return NextResponse.json({ received: true }, { status: 200 });
}