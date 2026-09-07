import { NextResponse } from 'next/server';

export async function proxy(request) {
  const token = request.cookies.get('session_token');
  const path = request.nextUrl.pathname;

  // Filtro de control: Solo interceptamos si el usuario intenta acceder al Dashboard o al panel de Admin
  if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
    
    // CAPA 1: Validación de presencia de sesión
    // Si no existe la cookie de sesión, enviamos de inmediato a iniciar sesión
    if (!token || !token.value) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    // Permitimos el paso hacia las rutas protegidas.
    // El dashboard y el panel de admin ya cuentan con validación de permisos
    // y el control de suscripción activa directamente en sus componentes.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};