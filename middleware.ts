import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Paths that don't require authentication
  const publicApiPaths = ['/api/admin/login'];

  // Skip auth check for public paths
  if (publicApiPaths.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }

  // Check auth for /admin and /api/admin routes
  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    const isAuthenticated = await verifySession();

    if (!isAuthenticated) {
      // For API routes, return 401 instead of redirect
      if (path.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // For page routes, redirect to login
      return NextResponse.redirect(new URL('/auth/admin-login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
