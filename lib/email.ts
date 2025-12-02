import nodemailer from 'nodemailer';

// Create reusable transporter using environment variables
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number.parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      'SMTP configuration is missing. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables.'
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

export interface ContactFormData {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  message: string;
}

export const sendContactEmail = async (formData: ContactFormData): Promise<void> => {
  const transporter = createTransporter();
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
  const recipientEmail = process.env.CONTACT_EMAIL;

  if (!fromEmail) {
    throw new Error('SMTP_FROM or SMTP_USER must be set');
  }

  if (!recipientEmail) {
    throw new Error('CONTACT_EMAIL environment variable must be set');
  }

  const mailOptions = {
    from: `"${formData.firstname} ${formData.lastname}" <${fromEmail}>`,
    replyTo: formData.email,
    to: recipientEmail,
    subject: `New Contact Form Submission from ${formData.firstname} ${formData.lastname}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #6a844a; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px;">
          <h3 style="color: #555; margin-top: 0;">Contact Information</h3>
          
          <p style="margin: 10px 0;">
            <strong>Name:</strong> ${formData.firstname} ${formData.lastname}
          </p>
          
          <p style="margin: 10px 0;">
            <strong>Email:</strong> 
            <a href="mailto:${formData.email}" style="color: #6a844a; text-decoration: none;">
              ${formData.email}
            </a>
          </p>
          
          ${formData.phone ? `
          <p style="margin: 10px 0;">
            <strong>Phone:</strong> 
            <a href="tel:${formData.phone}" style="color: #6a844a; text-decoration: none;">
              ${formData.phone}
            </a>
          </p>
          ` : ''}
          
          <h3 style="color: #555; margin-top: 30px;">Message</h3>
          <p style="background-color: white; padding: 15px; border-left: 4px solid #6a844a; margin: 10px 0; white-space: pre-wrap;">
            ${formData.message}
          </p>
        </div>
        
        <p style="color: #777; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
          This email was sent from the Elegardens contact form. You can reply directly to this email to respond to ${formData.firstname}.
        </p>
      </div>
    `,
    text: `
New Contact Form Submission

Contact Information:
Name: ${formData.firstname} ${formData.lastname}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ''}

Message:
${formData.message}

---
This email was sent from the Elegardens contact form.
    `.trim(),
  };

  await transporter.sendMail(mailOptions);
};

