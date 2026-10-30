import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializamos Resend con la variable de entorno que ya tienes en Railway
const resend = new Resend(process.env.RESEND_API_KEY);

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const data = await request.json();

    const {
      email,
      source,
      overallRating,
      modelsFeedback,
      usedForRealInvesting,
      requestedModels,
      missingFeatures,
      mostLiked,
      leastLiked,
      suggestions,
    } = data;

    // Construcción del contenido del correo en formato HTML limpio y legible
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">
          New User Feedback - Ourios Analytics
        </h2>
        
        <p><strong>User Email:</strong> ${email || 'Not provided (Anonymous)'}</p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        
        <p><strong>1. How did you hear about us?</strong><br />
        ${source || 'N/A'}</p>

        <p><strong>2. Overall experience rating (1 to 5):</strong><br />
        <span style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 2px 10px; border-radius: 6px; font-weight: bold;">
          ${overallRating || 'N/A'} / 5
        </span></p>

        <p><strong>3. How do you evaluate the current models (NAV, scrap, multiples)?</strong><br />
        ${modelsFeedback || 'No comments'}</p>

        <p><strong>4. Are you using the models for live shipping investments?</strong><br />
        ${usedForRealInvesting || 'N/A'}</p>

        <p><strong>5. Which companies, vessel segments (Tankers, Dry Bulk, Gas), or data would you add?</strong><br />
        ${requestedModels || 'No suggestions'}</p>

        <p><strong>6. Which tools or features do you miss the most?</strong><br />
        ${missingFeatures || 'No comments'}</p>

        <p><strong>7. What do you like the most?</strong><br />
        ${mostLiked || 'No comments'}</p>

        <p><strong>8. What do you like the least?</strong><br />
        ${leastLiked || 'No comments'}</p>

        <p><strong>9. If you could change one single thing, what would it be?</strong><br />
        ${suggestions || 'No comments'}</p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <small style="color: #64748b;">Feedback sent automatically from ouriosanalytics.com/feedback</small>
      </div>
    `;

    // Envío del correo mediante Resend
    // Nota: 'from' debe usar un dominio verificado o 'onboarding@resend.dev' para pruebas
    const { error } = await resend.emails.send({
      from: 'Ourios Analytics <feedback@ouriosanalytics.com>', 
      to: ['info@ouriosanalytics.com'], // <- Sustituye por tu dirección de correo donde quieres recibirlo
      subject: `[Survey Feedback] New response from ${email || 'Anonymous Investor'}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Error al enviar correo con Resend:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error('Error procesando el endpoint de encuesta:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}