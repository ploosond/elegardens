import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    // Get optional email from request body, or use default
    const body = await request.json().catch(() => ({}))
    const toEmail = body.email || process.env.SMTP_USER || 'test@example.com'

    // Send test email using Payload's email adapter
    await payload.email.sendEmail({
      to: toEmail,
      subject: 'Test Email from Elegardens',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6a844a;">Test Email</h1>
          <p>This is a test email from your Elegardens Payload CMS setup.</p>
          <p>If you received this email, your Nodemailer configuration is working correctly!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Sent at: ${new Date().toLocaleString()}<br>
            From: ${process.env.SMTP_USER || 'info@yoursite.com'}
          </p>
        </div>
      `,
      text: `
        Test Email
        
        This is a test email from your Elegardens Payload CMS setup.
        
        If you received this email, your Nodemailer configuration is working correctly!
        
        Sent at: ${new Date().toLocaleString()}
        From: ${process.env.SMTP_USER || 'info@yoursite.com'}
      `,
    })

    return NextResponse.json(
      {
        success: true,
        message: `Test email sent successfully to ${toEmail}`,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error sending test email:', error)
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to send test email',
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      },
      { status: 500 }
    )
  }
}

// Also allow GET for easy testing in browser
export async function GET() {
  return NextResponse.json(
    {
      message: 'Send a POST request to this endpoint to test email functionality',
      usage: {
        method: 'POST',
        body: {
          email: 'optional-email@example.com (defaults to SMTP_USER env variable)',
        },
      },
    },
    { status: 200 }
  )
}

