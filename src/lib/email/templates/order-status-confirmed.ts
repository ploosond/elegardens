import type { EmailTemplateData } from "../types";

type Locale = "en" | "de";

/**
 * Generate HTML email template for order status confirmation (when status changes to 'confirmed')
 */
export function generateOrderStatusConfirmedHTML(
  data: EmailTemplateData,
  locale: Locale = "en",
): string {
  const { order } = data;

  const translations = {
    en: {
      title: "Order Confirmed!",
      greeting: (companyName: string) => `Dear ${companyName},`,
      message:
        "We're happy to inform you that your order has been reviewed and confirmed.",
      processingMessage:
        "Our team will now proceed with processing your order. You will be notified once it is shipped.",
      orderSummary: "Order Details",
      orderNumber: "Order Number:",
      orderDate: "Order Date:",
      deliveryDate: "Delivery Date:",
      status: "Status:",
      orderItems: "Order Items",
      productId: "Product ID",
      productName: "Product Name",
      quantity: "Quantity",
      whatsNext: "What's Next?",
      nextSteps: [
        "Your order is confirmed and being prepared for delivery.",
        "We will notify you once your order is ready for shipment.",
        "If you have any questions, please don't hesitate to contact us.",
      ],
      needHelp: "Need Help?",
      helpText: "If you have any questions about your order, please contact us at:",
      thankYou: "Thank you for choosing Elegardens. We appreciate your business!",
      bestRegards: "Best regards,",
      teamName: "The Elegardens Team",
      footer: "This is an automated confirmation email. Please do not reply to this message.",
      confirmedOn: "Order confirmed on:",
    },
    de: {
      title: "Bestellung bestätigt!",
      greeting: (companyName: string) => `Sehr geehrte ${companyName},`,
      message:
        "Wir freuen uns, Ihnen mitteilen zu können, dass Ihre Bestellung geprüft und bestätigt wurde.",
      processingMessage:
        "Unser Team wird nun mit der Bearbeitung Ihrer Bestellung fortfahren. Sie werden benachrichtigt, sobald sie versandt wurde.",
      orderSummary: "Bestelldetails",
      orderNumber: "Bestellnummer:",
      orderDate: "Bestelldatum:",
      deliveryDate: "Lieferdatum:",
      status: "Status:",
      orderItems: "Bestellpositionen",
      productId: "Produkt-ID",
      productName: "Produktname",
      quantity: "Menge",
      whatsNext: "Was kommt als Nächstes?",
      nextSteps: [
        "Ihre Bestellung ist bestätigt und wird für die Lieferung vorbereitet.",
        "Wir benachrichtigen Sie, sobald Ihre Bestellung versandbereit ist.",
        "Wenn Sie Fragen haben, zögern Sie bitte nicht, uns zu kontaktieren.",
      ],
      needHelp: "Benötigen Sie Hilfe?",
      helpText: "Wenn Sie Fragen zu Ihrer Bestellung haben, kontaktieren Sie uns bitte unter:",
      thankYou: "Vielen Dank, dass Sie Elegardens gewählt haben. Wir schätzen Ihr Geschäft!",
      bestRegards: "Mit freundlichen Grüßen,",
      teamName: "Das Elegardens Team",
      footer: "Dies ist eine automatische Bestätigungs-E-Mail. Bitte antworten Sie nicht auf diese Nachricht.",
      confirmedOn: "Bestellung bestätigt am:",
    },
  };

  const t = translations[locale];

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

  const dateFormat = locale === "de" ? "de-DE" : "en-US";
  const confirmedDate = new Date().toLocaleString(dateFormat, {
    dateStyle: "long",
    timeStyle: "short",
  });

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #6a844a; border-bottom: 2px solid #6a844a; padding-bottom: 10px; margin-bottom: 20px;">
        ${escapeHtml(t.title)}
      </h1>
      
      <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        ${escapeHtml(t.greeting(data.client.companyName))}
      </p>
      
      <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        ${escapeHtml(t.message)}
      </p>

      <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        ${escapeHtml(t.processingMessage)}
      </p>

      <div style="margin-top: 25px; background-color: #f9f9f9; padding: 20px; border-radius: 5px; border-left: 4px solid #6a844a;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">${escapeHtml(
          t.orderSummary,
        )}</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">${escapeHtml(
              t.orderNumber,
            )}</td>
            <td style="padding: 8px 0; color: #333; font-weight: bold;">${escapeHtml(
              order.orderNumber,
            )}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">${escapeHtml(
              t.orderDate,
            )}</td>
            <td style="padding: 8px 0; color: #333;">${escapeHtml(
              order.orderDate || new Date().toLocaleDateString(dateFormat),
            )}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">${escapeHtml(
              t.deliveryDate,
            )}</td>
            <td style="padding: 8px 0; color: #333;">${escapeHtml(order.deliveryDate)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">${escapeHtml(
              t.status,
            )}</td>
            <td style="padding: 8px 0; color: #333;">${escapeHtml(
              locale === "de" ? "Bestätigt" : "Confirmed",
            )}</td>
          </tr>
        </table>
      </div>

      <div style="margin-top: 25px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">${escapeHtml(
          t.orderItems,
        )}</h2>
        
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background-color: #6a844a; color: white;">
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">${escapeHtml(
                t.productId,
              )}</th>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">${escapeHtml(
                t.productName,
              )}</th>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">${escapeHtml(
                t.quantity,
              )}</th>
            </tr>
          </thead>
          <tbody>
            ${itemsTableRows}
          </tbody>
        </table>
      </div>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 20px;">
        ${escapeHtml(t.thankYou)}
      </p>
      
      <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 10px;">
        ${escapeHtml(t.bestRegards)}<br>
        <strong>${escapeHtml(t.teamName)}</strong>
      </p>

      <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        ${escapeHtml(t.footer)}<br>
        ${escapeHtml(t.confirmedOn)} ${escapeHtml(confirmedDate)}
      </p>
    </div>
  `;
}

/**
 * Generate plain text email template for order status confirmation
 */
export function generateOrderStatusConfirmedText(
  data: EmailTemplateData,
  locale: Locale = "en",
): string {
  const { order } = data;

  const translations = {
    en: {
      title: "Order Confirmed!",
      greeting: (companyName: string) => `Dear ${companyName},`,
      message:
        "We're happy to inform you that your order has been reviewed and confirmed.",
      processingMessage:
        "Our team will now proceed with processing your order. You will be notified once it is shipped.",
      orderSummary: "Order Details:",
      orderNumber: "Order Number:",
      orderDate: "Order Date:",
      deliveryDate: "Delivery Date:",
      status: "Status:",
      orderItems: "Order Items:",
      quantity: "Quantity",
      whatsNext: "What's Next?",
      nextSteps: [
        "Your order is confirmed and being prepared for delivery.",
        "We will notify you once your order is ready for shipment.",
        "If you have any questions, please don't hesitate to contact us.",
      ],
      needHelp: "Need Help?",
      helpText: "If you have any questions about your order, please contact us at:",
      thankYou: "Thank you for choosing Elegardens. We appreciate your business!",
      bestRegards: "Best regards,",
      teamName: "The Elegardens Team",
      footer: "This is an automated confirmation email. Please do not reply to this message.",
      confirmedOn: "Order confirmed on:",
    },
    de: {
      title: "Bestellung bestätigt!",
      greeting: (companyName: string) => `Sehr geehrte ${companyName},`,
      message:
        "Wir freuen uns, Ihnen mitteilen zu können, dass Ihre Bestellung geprüft und bestätigt wurde.",
      processingMessage:
        "Unser Team wird nun mit der Bearbeitung Ihrer Bestellung fortfahren. Sie werden benachrichtigt, sobald sie versandt wurde.",
      orderSummary: "Bestelldetails:",
      orderNumber: "Bestellnummer:",
      orderDate: "Bestelldatum:",
      deliveryDate: "Lieferdatum:",
      status: "Status:",
      orderItems: "Bestellpositionen:",
      quantity: "Menge",
      whatsNext: "Was kommt als Nächstes?",
      nextSteps: [
        "Ihre Bestellung ist bestätigt und wird für die Lieferung vorbereitet.",
        "Wir benachrichtigen Sie, sobald Ihre Bestellung versandbereit ist.",
        "Wenn Sie Fragen haben, zögern Sie bitte nicht, uns zu kontaktieren.",
      ],
      needHelp: "Benötigen Sie Hilfe?",
      helpText: "Wenn Sie Fragen zu Ihrer Bestellung haben, kontaktieren Sie uns bitte unter:",
      thankYou: "Vielen Dank, dass Sie Elegardens gewählt haben. Wir schätzen Ihr Geschäft!",
      bestRegards: "Mit freundlichen Grüßen,",
      teamName: "Das Elegardens Team",
      footer: "Dies ist eine automatische Bestätigungs-E-Mail. Bitte antworten Sie nicht auf diese Nachricht.",
      confirmedOn: "Bestellung bestätigt am:",
    },
  };

  const t = translations[locale];

  const itemsList = order.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.itemName} (ID: ${item.itemId}) - ${t.quantity}: ${item.quantity}`,
    )
    .join("\n");

  const dateFormat = locale === "de" ? "de-DE" : "en-US";
  const confirmedDate = new Date().toLocaleString(dateFormat, {
    dateStyle: "long",
    timeStyle: "short",
  });

  return `
${t.title}

${t.greeting(data.client.companyName)}

${t.message}

${t.processingMessage}

${t.orderSummary}
${t.orderNumber} ${order.orderNumber}
${t.orderDate} ${order.orderDate || new Date().toLocaleDateString(dateFormat)}
${t.deliveryDate} ${order.deliveryDate}
${t.status} ${locale === "de" ? "Bestätigt" : "Confirmed"}

${t.orderItems}
${itemsList}

${t.thankYou}

${t.bestRegards}
${t.teamName}

---
${t.footer}
${t.confirmedOn} ${confirmedDate}
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
