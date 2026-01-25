import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import configPromise from '@payload-config';
import { getPayload } from 'payload';

/**
 * API route to check if client is authenticated
 * Uses Payload's internal API (like admin auth does)
 */
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('payload-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Use Payload's internal API directly (same pattern as admin)
    const payload = await getPayload({
      config: configPromise,
    });

    // Verify the token and get the user from the clients collection
    const { user } = await payload.auth({
      headers: request.headers,
    });

    if (!user || user.collection !== 'clients' || user.status !== 'active') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Authentication check failed' },
      { status: 500 },
    );
  }
}
