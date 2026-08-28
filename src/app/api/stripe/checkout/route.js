import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    // 1. Inicializamos Stripe DENTRO de la función para ocultarlo del compilador
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    const { priceId, userEmail, userId } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId parameter" }, { status: 400 });
    }

    const isSemestral = priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_SEMESTRAL;

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