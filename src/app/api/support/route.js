import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializamos Resend con la variable de entorno que ya usas en el proyecto
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    // Identificamos al usuario actual desde PostgreSQL a través de su token
    const userRes = await query(
      `SELECT u.name, u.email 
       FROM users u 
       JOIN sessions s ON u.id = s.user_id 
       WHERE s.session_token = $1`,
      [token]
    );

    if (userRes.rows.length === 0) {
      return NextResponse.json({ error: "User entity not found" }, { status: 401 });
    }

    const currentUser = userRes.rows[0];
    const { subject, message } = await request.json();

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message parameters required" }, { status: 400 });
    }

    // Envío del correo electrónico utilizando Resend hacia tu cuenta personal
    const data = await resend.emails.send({
      from: 'Ourios Terminal <onboarding@resend.dev>', // O tu dominio verificado en Resend
      to: ['abgrodriguezlpl@gmail.com'],
      subject: `[Ourios Support] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc; color: #0f172a;">
          <h2 style="color: #2563eb; text-transform: uppercase; font-size: 18px;">New Support Ticket Received</h2>
          <p><strong>Client Name:</strong> ${currentUser.name}</p>
          <p><strong>Client Email:</strong> ${currentUser.email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.5;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Ticket successfully transmitted", data }, { status: 200 });

  } catch (error) {
    console.error("Critical error in support dispatch:", error);
    return NextResponse.json({ error: "Internal operational fault during dispatch" }, { status: 500 });
  }
}