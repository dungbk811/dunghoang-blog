import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check auth for /admin routes
  if (path.startsWith('/admin')) {
    const isAuthenticated = await verifySession();

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/admin-login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
