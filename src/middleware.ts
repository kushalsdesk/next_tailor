import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LRUCache } from 'lru-cache';

// Using LRU cache to store IP request counts in memory
// Note: In serverless, memory isn't perfectly shared, but it works as a highly effective baseline shield per lambda instance
const rateLimitCache = new LRUCache<string, { count: number; startTime: number }>({
  max: 1000,
  ttl: 60 * 1000, // 1 minute window
});

export function middleware(request: NextRequest) {
  // Only apply to /api routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Get IP address
    const ip = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    const now = Date.now();
    let ipData = rateLimitCache.get(ip);

    if (!ipData) {
      ipData = { count: 1, startTime: now };
    } else {
      ipData.count++;
    }

    rateLimitCache.set(ip, ipData);

    // Limit to 60 requests per minute per IP
    if (ipData.count > 60) {
      return new NextResponse(
        JSON.stringify({ error: 'Too Many Requests - Rate limit exceeded' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
