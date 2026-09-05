import { NextResponse } from 'next/server';

export async function proxy(request) {
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
      const verifyRes = await fetch(new URL('/api/auth/verify-subscription', request.url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `session_token=${token.value}`
        }
      });

      if (!verifyRes.ok) {
        return NextResponse.redirect(new URL('/signin', request.url));
      }

      const { super: isSuperAdmin } = await verifyRes.json();

      // Regla estricta para el panel de Admin: Solo pasan superadministradores
      if (path.startsWith('/admin') && !isSuperAdmin) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Para el /dashboard, dejamos pasar a TODOS los usuarios registrados.
      // El Soft Gating (efecto borroso) se encargará de los usuarios caducados o sin fecha.
      return NextResponse.next();

    } catch (error) {
      console.error("Error crítico de verificación en el Guardián Middleware:", error);
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};