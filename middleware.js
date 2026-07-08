import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = request.cookies.get('session_token');
  const path = request.nextUrl.pathname;

  // Filtro de control: Solo interceptamos si el usuario intenta acceder al Dashboard o al panel de Admin
  if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
    
    // CAPA 1: Validación de Autenticación básica
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    try {
      // CAPA 2: Validación asíncrona en tiempo real contra PostgreSQL
      // Llamamos a un endpoint interno pasándole el token para verificar los plazos de Stripe de forma segura
      const verifyRes = await fetch(new URL('/api/auth/verify-subscription', request.url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `session_token=${token.value}` // Pasamos la cookie para que el endpoint identifique al usuario
        }
      });

      if (!verifyRes.ok) {
        // Si el servidor responde con error (ej: usuario no encontrado), mandamos a iniciar sesión
        return NextResponse.redirect(new URL('/signin', request.url));
      }

      const { super: isSuperAdmin, premium: isPremiumActive, valid: isSubscriptionValid } = await verifyRes.json();

      // Regla de Oro: El Superadmin tiene inmunidad total en el panel y no pasa por pasarelas
      if (isSuperAdmin) {
        return NextResponse.next();
      }

      // Si no es premium o el plazo de Stripe ha expirado, lo rebotamos a la landing con el flag de error
      if (!isPremiumActive || !isSubscriptionValid) {
        return NextResponse.redirect(new URL('/?error=subscription_expired', request.url));
      }

    } catch (error) {
      console.error("Error crítico de verificación en el Guardián Middleware:", error);
      // Fallback de seguridad: Ante un fallo de red interno, redirigimos preventivamente al signin
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  return NextResponse.next();
}

// Limitamos la ejecución del middleware estrictamente a las rutas del panel para optimizar el rendimiento
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};