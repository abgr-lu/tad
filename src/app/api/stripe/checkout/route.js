import { NextResponse } from "next/server";
import Stripe from "stripe";

// Forzamos a Next.js a procesar esta ruta dinámicamente, ignorándola en el build
export const dynamic = "force-dynamic";

// Añadimos un string vacío como respaldo y definimos la versión de la API
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

export async function POST(req) {
  try {
    const { priceId, userEmail, userId } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId parameter" }, { status: 400 });
    }

    // Comprobamos si es la oferta semestral y si el usuario ya existe en tu sistema
    const isSemestral = priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_SEMESTRAL;
    
    // Si tienes lógica para bloquear a usuarios existentes que intenten usar el semestral,
    // puedes meter una validación aquí con tu base de datos si userId existe.

    // Creamos la sesión de pago seguro en los servidores de Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // Pasamos metadatos clave para que el Webhook sepa a quién activar el acceso tras el cobro
      metadata: {
        userId: userId || null,
        userEmail: userEmail || null,
      },
      customer_email: userEmail || undefined,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}