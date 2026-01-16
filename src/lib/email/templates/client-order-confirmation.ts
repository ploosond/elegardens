import type { EmailTemplateData } from "../types";

/**
 * Generate HTML email template for client order confirmation
 */
export function generateClientOrderConfirmationHTML(
  data: EmailTemplateData,
): string {
  const { order } = data;

  const itemsTableRows = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${escapeHtml(
        item.itemId,
      )}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${escapeHtml(
        item.itemName,
      )}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
    </tr>
  `,
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #6a844a; border-bottom: 2px solid #6a844a; padding-bottom: 10px; margin-bottom: 20px;">
        Thank You for Your Order!
      </h1>
      
      <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        Dear ${escapeHtml(data.client.companyName)},
      </p>
      
      <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        We have received your order and are processing it. You will receive another email once your order has been confirmed and is ready for delivery.
      </p>

      <div style="margin-top: 25px; background-color: #f9f9f9; padding: 20px; border-radius: 5px; border-left: 4px solid #6a844a;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Order Summary</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Order Number:</td>
            <td style="padding: 8px 0; color: #333; font-weight: bold;">${escapeHtml(
              order.orderNumber,
            )}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Order Date:</td>
            <td style="padding: 8px 0; color: #333;">${escapeHtml(
              order.orderDate || new Date().toLocaleDateString(),
            )}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Delivery Date:</td>
            <td style="padding: 8px 0; color: #333;">${escapeHtml(order.deliveryDate)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Status:</td>
            <td style="padding: 8px 0; color: #333;">${escapeHtml(
              order.status.charAt(0).toUpperCase() + order.status.slice(1),
            )}</td>
          </tr>
        </table>
      </div>

      <div style="margin-top: 25px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Order Items</h2>
        
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background-color: #6a844a; color: white;">
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Product ID</th>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Product Name</th>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${itemsTableRows}
          </tbody>
        </table>
      </div>

      <div style="margin-top: 30px; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">What's Next?</h2>
        <p style="color: #333; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
          • We will review your order and confirm it shortly.<br>
          • You will receive updates on your order status via email.<br>
          • If you have any questions, please don't hesitate to contact us.
        </p>
      </div>

      <div style="margin-top: 30px; padding: 20px; background-color: #e8f4e8; border-radius: 5px; border-left: 4px solid #6a844a;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">Need Help?</h2>
        <p style="color: #333; font-size: 14px; line-height: 1.6; margin: 0;">
          If you have any questions about your order, please contact us at:<br>
          <a href="mailto:${escapeHtml(
            process.env.CONTACT_FORM_RECIPIENT || "info@elegardens.com",
          )}" style="color: #6a844a; text-decoration: none; font-weight: bold;">
            ${escapeHtml(process.env.CONTACT_FORM_RECIPIENT || "info@elegardens.com")}
          </a>
        </p>
      </div>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 20px;">
        Thank you for choosing Elegardens. We appreciate your business!
      </p>
      
      <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 10px;">
        Best regards,<br>
        <strong>The Elegardens Team</strong>
      </p>

      <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        This is an automated confirmation email. Please do not reply to this message.<br>
        Order placed on: ${new Date().toLocaleString("en-US", {
          dateStyle: "long",
          timeStyle: "short",
        })}
      </p>
    </div>
  `;
}

/**
 * Generate plain text email template for client order confirmation
 */
export function generateClientOrderConfirmationText(
  data: EmailTemplateData,
): string {
  const { order } = data;

  const itemsList = order.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.itemName} (ID: ${item.itemId}) - Quantity: ${item.quantity}`,
    )
    .join("\n");

  return `
Thank You for Your Order!

Dear ${data.client.companyName},

We have received your order and are processing it. You will receive another email once your order has been confirmed and is ready for delivery.

Order Summary:
Order Number: ${order.orderNumber}
Order Date: ${order.orderDate || new Date().toLocaleDateString()}
Delivery Date: ${order.deliveryDate}
Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}

Order Items:
${itemsList}

What's Next?
• We will review your order and confirm it shortly.
• You will receive updates on your order status via email.
• If you have any questions, please don't hesitate to contact us.

Need Help?
If you have any questions about your order, please contact us at:
${process.env.CONTACT_FORM_RECIPIENT || "info@elegardens.com"}

Thank you for choosing Elegardens. We appreciate your business!

Best regards,
The Elegardens Team

---
This is an automated confirmation email. Please do not reply to this message.
Order placed on: ${new Date().toLocaleString()}
  `.trim();
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
