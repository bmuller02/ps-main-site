export function middleware(request) {
  // 1. Get the session token from cookies using standard Web API
  const cookieHeader = request.headers.get('cookie') || '';
  const sessionToken = cookieHeader.split('; ').find(row => row.startsWith('session-token='))?.split('=')[1];

// 2. Determine the current path
  const url = new URL(request.url);
  const pathname = url.pathname;

  // ========================================
  // NOTE: This middleware runs on EVERY request
  // It checks if the user has a valid session
  // ========================================

// 3. List of paths that don't require authentication
  const publicPaths = [
    '/api/login',
    '/api/callback',
    '/api/logout',
    '/_next',
    '/favicon.ico',
  ];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

// 4. If it's a public path, allow access
  if (isPublicPath) {
    return new Response(null, {
      headers: { 'x-middleware-next': '1' }
    });
  }

  // 5. If no session token, redirect to login
  if (!sessionToken) {
    return Response.redirect(new URL('/api/login', request.url), 307);
  }

  // 6. Otherwise, allow access
  return new Response(null, {
    headers: { 'x-middleware-next': '1' }
  });}

  // TODO: ENGINEERING TEAM - Add token verification logic here
  // This should:
  // 1. Check if token exists in Redis/database
  // 2. Check if token has expired
  // 3. Return 401 if invalid/expired (user gets redirected to login)
  
  // For now, we'll assume token is valid if it exists
  // You'll need to implement actual verification

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
