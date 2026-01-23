import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Use same-origin URL to avoid cross-origin/env inconsistencies
    const logoutUrl = new URL('/api/clients/logout', request.url).toString();
    const cookieHeader = request.headers.get('cookie') || '';
    const hasCookie = cookieHeader.trim().length > 0;

    // If there is no auth cookie, skip upstream call to avoid 400 noise
    if (!hasCookie) {
      return NextResponse.json(
        { success: true, message: 'Logged out successfully' },
        { status: 200 },
      );
    }

    try {
      const logoutResponse = await fetch(logoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
      });

      // Get all Set-Cookie headers to clear the session
      const setCookieHeaders = logoutResponse.headers.getSetCookie();

      const response = NextResponse.json(
        {
          success: true,
          message: 'Logged out successfully',
        },
        { status: 200 },
      );

      // Forward cookie clearing headers if present
      if (setCookieHeaders && setCookieHeaders.length > 0) {
        setCookieHeaders.forEach((cookie) => {
          response.headers.append('Set-Cookie', cookie);
        });
      }

      return response;
    } catch (logoutError: any) {
      console.error('Logout error:', logoutError);
      // Even if Payload logout fails, return success to clear local state
      return NextResponse.json(
        {
          success: true,
          message: 'Logged out successfully',
        },
        { status: 200 },
      );
    }
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 },
    );
  }
}
