import { NextResponse } from 'next/server';

export function middleware(request) {
  // ========================================
  // NOTE: This middleware runs on EVERY request
  // It checks if the user has a valid session
  // ========================================

  // Get the session token from the user's cookie
  const sessionToken = request.cookies.get('session-token');

  // List of paths that don't require authentication
  // (API routes, static files, etc.)
  const publicPaths = [
    '/api/login',
    '/api/callback',
    '/api/logout',
    '/_next',
    '/favicon.ico',
  ];

  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // If no session token, redirect to login
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/api/login', request.url));
  }

  // TODO: ENGINEERING TEAM - Add token verification logic here
  // This should:
  // 1. Check if token exists in Redis/database
  // 2. Check if token has expired
  // 3. Return 401 if invalid/expired (user gets redirected to login)
  
  // For now, we'll assume token is valid if it exists
  // You'll need to implement actual verification

  return NextResponse.next();
}

export const config = {
  // This matcher determines which routes use this middleware
  // Currently: everything EXCEPT /api, /_next, and static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
