import { NextResponse, NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value || request.cookies.get("xrent_token")?.value;

  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/Admin') ||
    pathname.startsWith('/vehicles') ||
    pathname.startsWith('/clients') ||
    pathname.startsWith('/assignments') ||
    pathname.startsWith('/logs');

  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/Admin/:path*',
    '/vehicles/:path*',
    '/clients/:path*',
    '/assignments/:path*',
    '/logs/:path*',
    '/',
    '/login',
    '/register',
    '/customreg',
  ],
};
