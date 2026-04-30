import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('session_token');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}
