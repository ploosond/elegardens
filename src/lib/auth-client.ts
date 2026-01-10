import { cookies, headers } from 'next/headers'
import type { Client } from '@/payload-types'

/**
 * Get the authenticated client from the request
 * Returns null if not authenticated or if user is not a client
 */
export async function getAuthenticatedClient(): Promise<Client | null> {
  try {
    // Get cookies from headers (most up-to-date) or cookie store
    const headersList = await headers()
    const headerCookie = headersList.get('cookie') || ''

    const cookieStore = await cookies()
    const cookieArray: string[] = []
    cookieStore.getAll().forEach((cookie) => {
      cookieArray.push(`${cookie.name}=${cookie.value}`)
    })
    const storeCookieHeader = cookieArray.join('; ')

    const cookieHeader = headerCookie || storeCookieHeader

    const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'
    const meUrl = `${baseUrl}/api/client/me`

    const response = await fetch(meUrl, {
      method: 'GET',
      headers: {
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const responseData = await response.json()
    // Payload's /api/clients/me returns the user wrapped in a 'user' property
    const user = responseData.user || responseData

    // Validate user
    if (!user || !user.id || user.collection !== 'clients' || user.status !== 'active') {
      return null
    }

    return user as Client
  } catch (error) {
    return null
  }
}

/**
 * Check if a client is authenticated
 */
export async function isClientAuthenticated(): Promise<boolean> {
  const client = await getAuthenticatedClient()
  return client !== null
}

/**
 * Require authentication - throws error if not authenticated
 * Use this in server components/API routes that require authentication
 */
export async function requireClientAuth(): Promise<Client> {
  const client = await getAuthenticatedClient()

  if (!client) {
    throw new Error('Unauthorized: Client authentication required')
  }

  return client
}
