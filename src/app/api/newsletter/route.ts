import configPromise from "@payload-config";
import { getPayload } from "payload";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, consent } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required",
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
          error: "Invalid email format",
        },
        { status: 400 },
      );
    }

    // Get Payload instance
    const payload = await getPayload({
      config: configPromise,
    });

    // Check if email already exists
    try {
      const existingSubscriber = await payload.find({
        collection: "newsletter-subscribers",
        where: {
          email: {
            equals: email.toLowerCase().trim(),
          },
        },
        limit: 1,
      });

      if (existingSubscriber.docs.length > 0) {
        const subscriber = existingSubscriber.docs[0];

        // If already subscribed and active, return "Already subscribed" message
        if (subscriber.status === "active") {
          return NextResponse.json(
            {
              success: true,
              message: "Already subscribed",
            },
            { status: 200 },
          );
        }

        // If unsubscribed, reactivate the subscription
        if (subscriber.status === "unsubscribed") {
          await payload.update({
            collection: "newsletter-subscribers",
            id: subscriber.id,
            data: {
              status: "active",
              consent: consent !== false,
              subscribedAt: new Date().toISOString(),
              unsubscribedAt: null,
            },
          });

          // Optionally send welcome back email
          const sendWelcomeBack =
            process.env.NEWSLETTER_SEND_WELCOME_BACK === "true";

          if (sendWelcomeBack) {
            try {
              await payload.email.sendEmail({
                to: email,
                subject: "Welcome back to Elegardens Newsletter",
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #6a844a;">Welcome Back!</h1>
                    <p>Thank you for resubscribing to the Elegardens newsletter.</p>
                    <p>You'll receive helpful tips, updates, and exclusive offers straight to your inbox.</p>
                    <p>Best regards,<br>The Elegardens Team</p>
                  </div>
                `,
                text: `
Welcome Back!

Thank you for resubscribing to the Elegardens newsletter.

You'll receive helpful tips, updates, and exclusive offers straight to your inbox.

Best regards,
The Elegardens Team
                `,
              });
            } catch (emailError) {
              console.error("Error sending welcome back email:", emailError);
              // Don't fail the request if email fails
            }
          }

          return NextResponse.json(
            {
              success: true,
              message: "Successfully resubscribed!",
            },
            { status: 200 },
          );
        }
      }
    } catch (findError: any) {
      // If it's not a "not found" error, log it but continue
      if (findError.message && !findError.message.includes("Not Found")) {
        console.error("Error checking existing subscriber:", findError);
      }
    }

    // Create new subscriber
    try {
      await payload.create({
        collection: "newsletter-subscribers",
        data: {
          email: email.toLowerCase().trim(),
          consent: consent !== false,
          status: "active",
          subscribedAt: new Date().toISOString(),
        },
      });

      // Optionally send confirmation email
      const sendConfirmation =
        process.env.NEWSLETTER_SEND_CONFIRMATION === "true";

      if (sendConfirmation) {
        try {
          await payload.email.sendEmail({
            to: email,
            subject: "Welcome to Elegardens Newsletter",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #6a844a;">Thank You for Subscribing!</h1>
                <p>You've successfully subscribed to the Elegardens newsletter.</p>
                <p>You'll receive helpful tips, updates, and exclusive offers straight to your inbox.</p>
                <p>Best regards,<br>The Elegardens Team</p>
              </div>
            `,
            text: `
Thank You for Subscribing!

You've successfully subscribed to the Elegardens newsletter.

You'll receive helpful tips, updates, and exclusive offers straight to your inbox.

Best regards,
The Elegardens Team
            `,
          });
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
          // Don't fail the request if email fails
        }
      }

      return NextResponse.json(
        {
          success: true,
          message: "Successfully subscribed!",
        },
        { status: 200 },
      );
    } catch (createError: any) {
      // Check if it's a duplicate email error
      if (
        createError.message &&
        (createError.message.includes("duplicate") ||
          createError.message.includes("unique") ||
          createError.message.includes("already exists"))
      ) {
        return NextResponse.json(
          {
            success: true,
            message: "Already subscribed",
          },
          { status: 200 },
        );
      }

      throw createError;
    }
  } catch (error: any) {
    console.error("Error processing newsletter subscription:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to subscribe. Please try again later.",
        details:
          process.env.NODE_ENV === "development" ? error?.message : undefined,
      },
      { status: 500 },
    );
  }
}
