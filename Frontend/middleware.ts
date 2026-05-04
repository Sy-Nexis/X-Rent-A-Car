import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('xrent_token')?.value;
  const isAuthPage = request.nextUrl.pathname === '/login';
  const isAdminPage = request.nextUrl.pathname.startsWith('/Admin') || request.nextUrl.pathname === '/';

  // 1. If trying to access Admin or Root and NO TOKEN -> Redirect to Login
  if (isAdminPage && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If trying to access Login and HAS TOKEN -> Redirect to Admin
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/Admin', request.url));
  }

  return NextResponse.next();
}

// MATCHING STRATEGY
export const config = {
  matcher: ['/Admin/:path*', '/login', '/'],
};
