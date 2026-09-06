import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query as db } from '@/lib/db';
import bcrypt from 'bcrypt';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { sessionId, password } = await req.json();

    if (!sessionId || !password) {
      return NextResponse.json({ error: 'Faltan datos de seguridad' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });
    
    if (!session || session.payment_status !== 'paid') {
       return NextResponse.json({ error: 'El pago no es válido o no está completado.' }, { status: 400 });
    }

    const email = session.customer_details.email;
    let name = session.customer_details.name || email.split('@')[0];

    const priceId = session.line_items.data[0].price.id;

    const now = new Date();
    let endsAt = new Date();

    if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_NEW_USER) {
      endsAt.setMonth(now.getMonth() + 6);
    } else {
      endsAt.setMonth(now.getMonth() + 1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardamos al usuario nuevo
    await db(
      'INSERT INTO users (email, password, name, premium, subscription_ends_at) VALUES ($1, $2, $3, $4, $5)',
      [email, hashedPassword, name, true, endsAt.toISOString()]
    );

    // Enviamos el Email de Bienvenida
    const { data, error } = await resend.emails.send({
      from: 'Ourios Analytics <noreply@ouriosanalytics.com>', // Tu correo automático sin buzón
      reply_to: 'info@ouriosanalytics.com', // Si responden, va a tu Zoho
      to: [email],
      subject: 'Welcome to Ourios Analytics!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a;">
          <h2 style="color: #2563eb;">Welcome to Ourios Analytics</h2>
          <p>Hello ${name},</p>
          <p>Your account has been created successfully. You now have full access to our professional maritime investment models and vessel valuations.</p>
          <p>You can log in to your dashboard anytime to explore the latest data.</p>
        </div>
      `
    });

    // Si Resend nos devuelve un error interno, lo mostramos en consola
    if (error) {
      console.error('❌ Error interno de Resend (Bienvenida):', error);
    } else {
      console.log('✅ Email de bienvenida enviado con éxito:', data);
    }

    return NextResponse.json({ message: 'Cuenta creada con éxito' }, { status: 200 });

  } catch (error) {
    console.error('Error al configurar la cuenta:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}