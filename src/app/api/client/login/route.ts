import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required',
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        { status: 400 },
      )
    }

    // Get Payload instance
    const payload = await getPayload({
      config: configPromise,
    })

    // Check if client exists and is active before attempting login
    const clients = await payload.find({
      collection: 'clients',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    if (clients.docs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
        },
        { status: 401 },
      )
    }

    const client = clients.docs[0]

    // Check if client account is active
    if (client.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: 'Your account is inactive. Please contact support.',
        },
        { status: 403 },
      )
    }

    const baseUrl = process.env.SERVER_URL || 'http://localhost:3000'
    const loginUrl = `${baseUrl}/api/clients/login`

    try {
      const cookieHeader = request.headers.get('cookie') || ''

      const loginResponse = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json().catch(() => ({}))
        return NextResponse.json(
          {
            success: false,
            error: errorData.message || 'Invalid email or password',
          },
          { status: 401 },
        )
      }

      const loginData = await loginResponse.json()
      const setCookieHeaders = loginResponse.headers.getSetCookie()

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
      )

      // Forward session cookies
      if (setCookieHeaders && setCookieHeaders.length > 0) {
        setCookieHeaders.forEach((cookie) => {
          response.headers.append('Set-Cookie', cookie)
        })
      }

      return response
    } catch (authError: any) {
      console.error('Authentication error:', authError)
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication failed. Please try again.',
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An error occurred during login',
      },
      { status: 500 },
    )
  }
}
