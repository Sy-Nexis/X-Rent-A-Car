import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value || request.cookies.get("xrent_token")?.value;

  const isAuthRoute = pathname === '/' || pathname === '/login' || pathname === '/register';
  const isDashboardRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/Admin') ||
    pathname.startsWith('/vehicles') ||
    pathname.startsWith('/clients') ||
    pathname.startsWith('/settings');

  // If user is trying to access protected route without token, redirect to login page
  if (isDashboardRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/Admin/:path*',
    '/vehicles/:path*',
    '/clients/:path*',
    '/settings/:path*',
    '/',
    '/login',
    '/register',
  ],
};
