import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * API route to check if client is authenticated
 * Proxies to Payload's /api/clients/me endpoint with proper cookie handling
 */
export async function GET() {
  try {
    const cookieStore = await cookies();

    // Build cookie header string
    const cookieArray: string[] = [];
    cookieStore.getAll().forEach((cookie) => {
      cookieArray.push(`${cookie.name}=${cookie.value}`);
    });
    const cookieHeader = cookieArray.join('; ');

    // Use internal localhost URL to avoid TLS/proxy confusion.
    // Inside the container, always call http://localhost:3000, not the external domain.
    const meUrl = 'http://localhost:3000/api/clients/me';

    const response = await fetch(meUrl, {
      method: 'GET',
      headers: {
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: response.status },
      );
    }

    const user = await response.json();
    return NextResponse.json(user);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Authentication check failed' },
      { status: 500 },
    );
  }
}
