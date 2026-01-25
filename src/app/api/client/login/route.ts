import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required',
        },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        { status: 400 },
      );
    }

    // Ensure Payload is initialized (guarantees API routes are ready)
    await getPayload({
      config: configPromise,
    });

    // Use internal localhost URL to avoid TLS/proxy confusion.
    // Inside the container, always call http://localhost:3000, not the external domain.
    const loginUrl = 'http://localhost:3000/api/clients/login';

    try {
      const loginResponse = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const loginData = await loginResponse.json().catch(() => ({}) as any);

      if (!loginResponse.ok) {
        const status = loginResponse.status || 401;
        const message =
          (loginData && (loginData.error || loginData.message)) ||
          'Invalid email or password';
        return NextResponse.json(
          {
            success: false,
            error: message,
          },
          { status },
        );
      }
      const setCookieHeaders = loginResponse.headers.getSetCookie();

      const response = NextResponse.json(
        {
          success: true,
          user: {
            id: loginData.user.id,
            email: loginData.user.email,
            clientId: loginData.user.clientId,
            companyName: loginData.user.companyName,
            contactPerson: loginData.user.contactPerson,
            phone: loginData.user.phone,
          },
          token: loginData.token,
        },
        { status: 200 },
      );

      // Forward session cookies
      if (setCookieHeaders && setCookieHeaders.length > 0) {
        setCookieHeaders.forEach((cookie) => {
          response.headers.append('Set-Cookie', cookie);
        });
      }

      return response;
    } catch (authError: any) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication failed. Please try again.',
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An error occurred during login',
      },
      { status: 500 },
    );
  }
}
