import { NextRequest, NextResponse } from 'next/server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let payload: { email?: string; consent?: boolean } = {};
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = (payload.email || '').trim();
  const consent = Boolean(payload.consent);

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: 'Invalid email address' },
      { status: 400 }
    );
  }

  // For now, proxy to existing upstream service; later this can send emails directly.
  const upstream =
    process.env.NEWSLETTER_UPSTREAM ||
    'https://ele-gardens-r6f2.onrender.com/api/newsletter';

  try {
    const res = await fetch(upstream, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, consent }),
      // Route handlers run on the server; no need for cache.
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error || 'Subscription failed' },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Subscription service unavailable' },
      { status: 502 }
    );
  }
}
