import { NextResponse } from 'next/server';
import { query as db } from '@/lib/db';
import crypto from 'crypto';
import { Resend } from 'resend';

// 1. Inicializamos el cliente de Resend con tu variable de entorno
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email } = await req.json();

    // 2. Comprobar si el usuario existe en tu tabla de PostgreSQL
    const userResult = await db('SELECT * FROM users WHERE email = $1', [email]);
    
    // Si el email no existe, devolvemos éxito silencioso por seguridad
    if (userResult.rows.length === 0) {
      return NextResponse.json({ message: 'Email procesado' }, { status: 200 });
    }

    // 3. Generar un token criptográfico y establecer caducidad (1 hora)
    const token = crypto.randomBytes(32).toString('hex');
    //const expiresAt = new Date(Date.now() + 3600000).toISOString();

    // 4. Guardar el token en tu tabla 'password_resets'
    await db(
      "INSERT INTO password_resets (email, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '1 hour')",
  [email, token]
    );

    // 5. Construir el enlace dinámico de recuperación
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    
    // 6. Enviar el email utilizando Resend
    const { data, error } = await resend.emails.send({
      from: 'Ourios Analytics <noreply@ouriosanalytics.com>', // El remitente que has configurado
      to: [email], // El correo del usuario
      subject: 'Password Recovery - Ourios Analytics',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #0f172a;">Password Reset Request</h2>
          <p style="color: #475569; line-height: 1.5;">You requested to reset your password for your <strong>Ourios Analytics</strong> account. Click the button below to securely set a new one:</p>
          
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
            Reset Password
          </a>
          
          <p style="color: #64748b; font-size: 12px; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            If you didn't request this, you can safely ignore this email. This link will expire in 1 hour for security reasons.
          </p>
        </div>
      `,
    });

    // Si Resend nos devuelve un error interno, lo capturamos
    if (error) {
      console.error('Error de Resend:', error);
      return NextResponse.json({ error: 'Fallo al enviar el correo' }, { status: 400 });
    }

    // Respuesta exitosa
    return NextResponse.json({ message: 'Email enviado con éxito', data }, { status: 200 });

  } catch (error) {
    console.error('Error en forgot-password API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}