import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query as db } from '@/lib/db';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });
    
    if (session.payment_status !== 'paid') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    const email = session.customer_details.email;
    const priceId = session.line_items.data[0].price.id;

    const now = new Date();
    let endsAt = new Date();
    
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL) {
      endsAt.setFullYear(now.getFullYear() + 1);
    } else {
      endsAt.setMonth(now.getMonth() + 1);
    }

    // Actualizamos la Base de Datos al instante (sin pedir contraseña)
    await db(
      'UPDATE users SET premium = true, subscription_ends_at = $1 WHERE email = $2',
      [endsAt.toISOString(), email]
    );

    // Enviamos el Email de Renovación
    const { data, error } = await resend.emails.send({
      from: 'Ourios Analytics <noreply@ouriosanalytics.com>', // Tu correo automático sin buzón
      reply_to: 'info@ouriosanalytics.com', // Si responden, va a tu Zoho
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
      console.error('❌ Error interno de Resend (Renovación):', error);
    } else {
      console.log('✅ Email de renovación enviado con éxito:', data);
    }

    return NextResponse.redirect(new URL('/dashboard', req.url));

  } catch (error) {
    console.error('Error procesando la renovación:', error);
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
}