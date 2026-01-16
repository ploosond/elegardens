import configPromise from "@payload-config";
import { getPayload } from "payload";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstname, lastname, email, phone, message } = body;

    // Validate required fields
    if (!firstname || !lastname || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
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

    // Save submission to Payload CMS
    try {
      await payload.create({
        collection: "contact-submissions",
        data: {
          firstname,
          lastname,
          email,
          phone: phone || undefined,
          message,
          status: "new",
        },
      });
    } catch (dbError: any) {
      // Log the error but don't fail the request if email sending works
      console.error("Error saving contact submission to database:", dbError);
      // Continue with email sending even if DB save fails
    }

    // Get the recipient email from environment or use default
    const recipientEmail =
      process.env.CONTACT_FORM_RECIPIENT ||
      process.env.SMTP_USER ||
      "info@elegardens.com";

    // Send email to the business
    await payload.email.sendEmail({
      to: recipientEmail,
      subject: `New Contact Form Submission from ${firstname} ${lastname}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6a844a; border-bottom: 2px solid #6a844a; padding-bottom: 10px;">
            New Contact Form Submission
          </h1>
          
          <div style="margin-top: 20px;">
            <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Contact Information</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Name:</td>
                <td style="padding: 8px 0; color: #333;">${firstname} ${lastname}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 8px 0; color: #333;">
                  <a href="mailto:${email}" style="color: #6a844a; text-decoration: none;">${email}</a>
                </td>
              </tr>
              ${
                phone
                  ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                <td style="padding: 8px 0; color: #333;">
                  <a href="tel:${phone}" style="color: #6a844a; text-decoration: none;">${phone}</a>
                </td>
              </tr>
              `
                  : ""
              }
            </table>
          </div>

          <div style="margin-top: 25px;">
            <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Message</h2>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; border-left: 4px solid #6a844a; color: #333; white-space: pre-wrap; line-height: 1.6;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This email was sent from the contact form on your website.<br>
            Received at: ${new Date().toLocaleString("en-US", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
        </div>
      `,
      text: `
New Contact Form Submission

Contact Information:
Name: ${firstname} ${lastname}
Email: ${email}
${phone ? `Phone: ${phone}` : ""}

Message:
${message}

---
This email was sent from the contact form on your website.
Received at: ${new Date().toLocaleString()}
      `,
    });

    // Optionally send a confirmation email to the user
    const sendConfirmation =
      process.env.CONTACT_FORM_SEND_CONFIRMATION === "true";

    if (sendConfirmation) {
      await payload.email.sendEmail({
        to: email,
        subject: "Thank you for contacting Elegardens",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #6a844a;">Thank You for Your Message</h1>
            <p>Dear ${firstname} ${lastname},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p>Your message:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; color: #333; white-space: pre-wrap;">
              ${message.replace(/\n/g, "<br>")}
            </div>
            <p>Best regards,<br>The Elegardens Team</p>
          </div>
        `,
        text: `
Thank You for Your Message

Dear ${firstname} ${lastname},

We have received your message and will get back to you as soon as possible.

Your message:
${message}

Best regards,
The Elegardens Team
        `,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Your message has been sent successfully. We will get back to you soon!",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message. Please try again later.",
        details:
          process.env.NODE_ENV === "development" ? error?.message : undefined,
      },
      { status: 500 },
    );
  }
}
