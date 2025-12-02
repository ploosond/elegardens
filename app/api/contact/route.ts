import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstname, lastname, email, phone, message } = body;

    // Validate required fields
    if (!firstname || !lastname || !email || !message) {
      return NextResponse.json(
        { error: 'All required fields must be filled.' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    // Send email
    await sendContactEmail({
      firstname,
      lastname,
      email,
      phone,
      message,
    });

    return NextResponse.json(
      { message: 'Thank you for your message! We will get back to you soon.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('SMTP configuration')) {
        return NextResponse.json(
          {
            error:
              'Email service is not configured. Please contact the administrator.',
          },
          { status: 500 }
        );
      }
      if (error.message.includes('CONTACT_EMAIL')) {
        return NextResponse.json(
          {
            error:
              'Contact email is not configured. Please contact the administrator.',
          },
          { status: 500 }
        );
      }
      // Log the full error for debugging
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
