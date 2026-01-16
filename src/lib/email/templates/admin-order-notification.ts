import type { EmailTemplateData } from "../types";

/**
 * Generate HTML email template for admin order notification
 */
export function generateAdminOrderNotificationHTML(
  data: EmailTemplateData,
): string {
  const { order, client } = data;

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
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${
        item.quantity
      }</td>
    </tr>
  `,
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #6a844a; border-bottom: 2px solid #6a844a; padding-bottom: 10px; margin-bottom: 20px;">
        New Order Received
      </h1>
      
      <div style="margin-top: 20px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Order Information</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Order Number:</td>
            <td style="padding: 8px 0; color: #333; font-weight: bold;">${escapeHtml(
              order.orderNumber,
            )}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Status:</td>
            <td style="padding: 8px 0; color: #333;">${escapeHtml(
              order.status.toUpperCase(),
            )}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Order Date:</td>
            <td style="padding: 8px 0; color: #333;">${escapeHtml(
              order.orderDate || "N/A",
            )}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Delivery Date:</td>
            <td style="padding: 8px 0; color: #333;">${escapeHtml(
              order.deliveryDate,
            )}</td>
          </tr>
        </table>
      </div>

      <div style="margin-top: 25px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Client Information</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Company:</td>
            <td style="padding: 8px 0; color: #333;">${escapeHtml(
              client.companyName,
            )}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Client ID:</td>
            <td style="padding: 8px 0; color: #333;">${escapeHtml(
              client.clientId,
            )}</td>
          </tr>
          ${
            client.contactPerson
              ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Contact Person:</td>
            <td style="padding: 8px 0; color: #333;">${escapeHtml(
              client.contactPerson,
            )}</td>
          </tr>
          `
              : ""
          }
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
            <td style="padding: 8px 0; color: #333;">
              <a href="mailto:${escapeHtml(client.email)}" style="color: #6a844a; text-decoration: none;">${escapeHtml(
                client.email,
              )}</a>
            </td>
          </tr>
          ${
            client.phone
              ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
            <td style="padding: 8px 0; color: #333;">
              <a href="tel:${escapeHtml(client.phone)}" style="color: #6a844a; text-decoration: none;">${escapeHtml(
                client.phone,
              )}</a>
            </td>
          </tr>
          `
              : ""
          }
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

      ${
        order.notes
          ? `
      <div style="margin-top: 25px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Client Notes</h2>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; border-left: 4px solid #6a844a; color: #333; white-space: pre-wrap; line-height: 1.6;">
          ${escapeHtml(order.notes)}
        </div>
      </div>
      `
          : ""
      }

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <div style="margin-top: 20px; text-align: center;">
        <a href="${data.adminPanelUrl}/admin/collections/orders/${order.id}" 
           style="display: inline-block; padding: 12px 24px; background-color: #6a844a; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
          View Order in Admin Panel
        </a>
      </div>

      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        This email was automatically generated when a new order was placed.<br>
        Received at: ${new Date().toLocaleString("en-US", {
          dateStyle: "long",
          timeStyle: "short",
        })}
      </p>
    </div>
  `;
}

/**
 * Generate plain text email template for admin order notification
 */
export function generateAdminOrderNotificationText(
  data: EmailTemplateData,
): string {
  const { order, client } = data;

  const itemsList = order.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.itemName} (ID: ${item.itemId}) - Quantity: ${item.quantity}`,
    )
    .join("\n");

  return `
New Order Received

Order Information:
Order Number: ${order.orderNumber}
Status: ${order.status.toUpperCase()}
Order Date: ${order.orderDate || "N/A"}
Delivery Date: ${order.deliveryDate}

Client Information:
Company: ${client.companyName}
Client ID: ${client.clientId}
${client.contactPerson ? `Contact Person: ${client.contactPerson}\n` : ""}Email: ${client.email}
${client.phone ? `Phone: ${client.phone}\n` : ""}
Order Items:
${itemsList}

${order.notes ? `Client Notes:\n${order.notes}\n` : ""}
View order in admin: ${data.adminPanelUrl}/admin/collections/orders/${order.id}

---
This email was automatically generated when a new order was placed.
Received at: ${new Date().toLocaleString()}
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
