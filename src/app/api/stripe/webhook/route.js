import { NextResponse } from "next/server";
import Stripe from "stripe";
import { query } from "@/lib/db"; // 1. Corregida la importación de PostgreSQL

// Desactivamos el parseo automático de Next.js porque Stripe necesita el body en crudo (raw) para verificar la firma
export const dynamic = "force-dynamic";

export async function POST(req) {
  // Inicializamos Stripe dentro de la función para leer la variable de entorno en tiempo de ejecución
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });

  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("❌ Falta la cabecera stripe-signature en la petición.");
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event;

  try {
    // Verificamos de forma estricta que la petición venga realmente de Stripe usando tu whsec_...
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
      try {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        
        const rawEmail = session.metadata?.userEmail || session.customer_details?.email;
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        
        // Stripe trabaja con Timestamps en segundos; convertimos a formato ISO para PostgreSQL
        const endsAt = new Date(subscription.current_period_end * 1000).toISOString();

        console.log(`💰 Checkout completado con éxito para: ${rawEmail}`);

        if (rawEmail) {
          // ACTUALIZACIÓN EN TU BASE DE DATOS POSTGRESQL
          await query(
            `UPDATE users 
             SET premium = true, 
                 stripe_customer_id = $1, 
                 stripe_subscription_id = $2, 
                 subscription_ends_at = $3 
             WHERE LOWER(email) = LOWER($4)`,
            [customerId, subscriptionId, endsAt, rawEmail]
          );
          console.log(`✅ Usuario ${rawEmail} activado correctamente en la base de datos.`);
        } else {
          console.warn("⚠️ No se encontró email asociado en la sesión de checkout.");
        }
      } catch (dbErr) {
        console.error("Error actualizando usuario en Checkout Webhook:", dbErr);
      }
      break;
    }

    case "invoice.payment_succeeded": {
      if (session.subscription) {
        try {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          const endsAt = new Date(subscription.current_period_end * 1000).toISOString();

          console.log(`🔄 Renovación automática procesada para la suscripción: ${session.subscription}`);

          await query(
            `UPDATE users 
             SET premium = true, 
                 subscription_ends_at = $1 
             WHERE stripe_subscription_id = $2`,
            [endsAt, session.subscription]
          );
          console.log(`✅ Fecha de suscripción prorrogada hasta: ${endsAt}`);
        } catch (dbErr) {
          console.error("Error al renovar suscripción en Webhook:", dbErr);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      console.log(`🚫 Suscripción cancelada o expirada: ${session.id}`);

      try {
        await query(
          `UPDATE users 
           SET premium = false, 
               subscription_ends_at = NOW() 
           WHERE stripe_subscription_id = $1`,
          [session.id]
        );
        console.log(`🔒 Acceso revocado para la suscripción cancelada: ${session.id}`);
      } catch (dbErr) {
        console.error("Error al cancelar suscripción en Webhook:", dbErr);
      }
      break;
    }

    default:
      console.log(`ℹ️ Evento de Stripe no controlado de forma específica: ${event.type}`);
  }

  // Respondemos con 200 OK para que Stripe sepa que la notificación fue recibida y no reintente
  return NextResponse.json({ received: true }, { status: 200 });
}