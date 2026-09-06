import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query as db } from '@/lib/db';
import { Resend } from 'resend';

// 1. Forzamos a Next.js a tratar esta ruta como puramente dinámica
// Esto evita que intente ejecutarla durante el build en Railway
export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  // Si no hay sesión, redirigimos al dashboard inmediatamente
  if (!sessionId) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 2. Inicialización segura en tiempo de ejecución
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (!stripeKey) {
    console.error('⚠️ STRIPE_SECRET_KEY no está definida en las variables de entorno.');
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  const stripe = new Stripe(stripeKey);
  const resend = resendKey ? new Resend(resendKey) : null;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });
    
    if (session.payment_status !== 'paid') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    const email = session.customer_details?.email;
    if (!email) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    const priceId = session.line_items?.data[0]?.price?.id;

    // Calculamos la nueva fecha de suscripción
    const now = new Date();
    let endsAt = new Date();
    
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL) {
      endsAt.setFullYear(now.getFullYear() + 1);
    } else {
      endsAt.setMonth(now.getMonth() + 1);
    }

    // Actualizamos la base de datos
    await db(
      'UPDATE users SET premium = true, subscription_ends_at = $1 WHERE email = $2',
      [endsAt.toISOString(), email]
    );

    // Enviamos el correo de confirmación si Resend está configurado
    if (resend) {
      try {
        const { data, error } = await resend.emails.send({
          from: 'Ourios Analytics <noreply@ouriosanalytics.com>',
          reply_to: 'info@ouriosanalytics.com',
          to: [email],
          subject: 'Subscription Renewed - Ourios Analytics',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a;">
              <h2 style="color: #2563eb;">Subscription Renewed Successfully</h2>
              <p>Welcome back! Your subscription to Ourios Analytics has been successfully renewed.</p>
              <p><strong>New Expiration Date:</strong> ${endsAt.toLocaleDateString()}</p>
              <p>You can now continue accessing all the institutional data and models seamlessly.</p>
            </div>
          `
        });

        if (error) {
          console.error('❌ Error devuelto por Resend al renovar:', error);
        } else {
          console.log('✅ Correo de renovación enviado:', data);
        }
      } catch (emailErr) {
        console.error('Error al enviar el correo de renovación:', emailErr);
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY no configurada. Omitiendo envío de correo.');
    }

    return NextResponse.redirect(new URL('/dashboard', req.url));

  } catch (error) {
    console.error('Error procesando la renovación en Stripe/DB:', error);
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
}