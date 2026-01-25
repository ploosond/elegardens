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

    // Use Payload's internal API directly (like admin login does)
    // No external fetch required - this is the same pattern as /admin login
    const payload = await getPayload({
      config: configPromise,
    });

    try {
      // Call Payload's login API directly (same as admin auth)
      const loginResult = await payload.login({
        collection: 'clients',
        data: {
          email,
          password,
        },
      });

      if (!loginResult.user) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid email or password',
          },
          { status: 401 },
        );
      }

      const loginData = loginResult;

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

      // Set the session cookie (Payload provides this)
      if (loginData.token) {
        // Payload sets cookies internally, but we can also set explicitly
        // COOKIE_SECURE controls whether the cookie requires HTTPS:
        // - Set to 'true' for HTTPS (domain with SSL)
        // - Set to 'false' for HTTP (VPS IP without domain)
        // If not set, defaults to false (allows HTTP)
        const isSecure = process.env.COOKIE_SECURE === 'true';
        response.cookies.set('payload-token', loginData.token, {
          httpOnly: true,
          secure: isSecure,
          sameSite: 'lax',
          path: '/',
        });
      }

      return response;
    } catch (authError: any) {
      console.error('Authentication error:', authError);

      // Check if it's an authentication error (wrong credentials)
      if (
        authError.name === 'AuthenticationError' ||
        authError.status === 401
      ) {
        return NextResponse.json(
          {
            success: false,
            error: authError.message || 'Invalid email or password',
          },
          { status: 401 },
        );
      }

      // Other errors (server issues, etc.)
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
