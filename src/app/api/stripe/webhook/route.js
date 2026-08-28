import { NextResponse } from "next/server";
import Stripe from "stripe";

// Añadimos el string vacío de respaldo y la versión de la API
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

// Desactivamos el parseo automático de Next.js porque Stripe necesita el body en crudo (raw) para verificar la firma
export const dynamic = "force-dynamic";

export async function POST(req) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    // Verificamos de forma estricta que la petición venga realmente de Stripe y no sea un ataque impostor
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`❌ Error de firma en Webhook: ${err.message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const session = event.data.object;

  // Manejo de eventos del ciclo de vida de la suscripción
  switch (event.type) {
    case "checkout.session.completed": {
      // Ocurre cuando el usuario paga por primera vez en la Landing
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      
      const email = session.metadata?.userEmail || session.customer_details?.email;
      const customerId = session.customer;
      const subscriptionId = session.subscription;
      
      // Stripe trabaja con Timestamps en segundos, PostgreSQL necesita milisegundos para Date
      const endsAt = new Date(subscription.current_period_end * 1000).toISOString();

      console.log(`💰 Checkout completado con éxito para: ${email}`);

      // ACTUALIZACIÓN EN TU POSTGRESQL
      // Activamos el flag 'premium', asignamos sus IDs de Stripe y la fecha de expiración
      // NOTA: Adapta la query SQL a tu librería de conexión (ej: pg pool, prisma, etc.)
      try {
        await db.query(
          `UPDATE users 
           SET premium = true, 
               stripe_customer_id = $1, 
               stripe_subscription_id = $2, 
               subscription_ends_at = $3 
           WHERE email = $4`,
          [customerId, subscriptionId, endsAt, email]
        );
      } catch (dbErr) {
        console.error("Error actualizando usuario en Checkout Webhook:", dbErr);
      }
      break;
    }

    case "invoice.payment_succeeded": {
      // Ocurre de forma automática cada mes/año cuando se renueva la suscripción sin que el usuario intervenga
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const endsAt = new Date(subscription.current_period_end * 1000).toISOString();

        console.log(`🔄 Renovación automática procesada para la suscripción: ${session.subscription}`);

        try {
          await db.query(
            `UPDATE users 
             SET premium = true, 
                 subscription_ends_at = $1 
             WHERE stripe_subscription_id = $2`,
            [endsAt, session.subscription]
          );
        } catch (dbErr) {
          console.error("Error al renovar suscripción en Webhook:", dbErr);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      // Ocurre si el usuario cancela su suscripción o si el banco rechaza los cobros tras varios intentos
      console.log(`🚫 Suscripción cancelada o expirada: ${session.id}`);

      try {
        await db.query(
          `UPDATE users 
           SET premium = false, 
               subscription_ends_at = NOW() 
           WHERE stripe_subscription_id = $1`,
          [session.id]
        );
      } catch (dbErr) {
        console.error("Error al cancelar suscripción en Webhook:", dbErr);
      }
      break;
    }

    default:
      console.log(`ℹ️ Evento de Stripe no controlado de forma específica: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}