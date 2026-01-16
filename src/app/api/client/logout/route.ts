import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Use Payload's REST API endpoint for proper cookie handling
    const baseUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
    const logoutUrl = `${baseUrl}/api/clients/logout`;

    // Forward cookies from the incoming request
    const cookieHeader = request.headers.get("cookie") || "";

    try {
      const logoutResponse = await fetch(logoutUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
      });

      // Get the set-cookie header to clear the session
      const setCookieHeader = logoutResponse.headers.get("set-cookie");

      const response = NextResponse.json(
        {
          success: true,
          message: "Logged out successfully",
        },
        { status: 200 },
      );

      // Forward the cookie clearing header if present
      if (setCookieHeader) {
        response.headers.set("Set-Cookie", setCookieHeader);
      }

      return response;
    } catch (logoutError: any) {
      console.error("Logout error:", logoutError);
      // Even if Payload logout fails, we'll still return success
      // to clear any local state
      return NextResponse.json(
        {
          success: true,
          message: "Logged out successfully",
        },
        { status: 200 },
      );
    }
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 },
    );
  }
}
