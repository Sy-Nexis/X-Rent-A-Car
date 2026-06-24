import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Auth is handled client-side via component state in page.tsx.
  // No URL-based /login route exists — this middleware is a no-op for now.
  return NextResponse.next();
}

// MATCHING STRATEGY
export const config = {
  matcher: ['/Admin/:path*', '/login', '/'],
};
