import type { EmailTemplateData } from "../types";

type Locale = "en" | "de";

export type NotifiableOrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "completed"
  | "cancelled";

const NOTIFIABLE_STATUSES: NotifiableOrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "completed",
  "cancelled",
];

/**
 * Type guard for statuses that trigger a client notification
 */
export function isNotifiableOrderStatus(
  status: unknown,
): status is NotifiableOrderStatus {
  return NOTIFIABLE_STATUSES.includes(status as NotifiableOrderStatus);
}

/**
 * Statuses whose email carries the order Excel sheet as an attachment
 */
export function statusIncludesExcelAttachment(
  status: NotifiableOrderStatus,
): boolean {
  return status === "confirmed";
}

/**
 * Copy that varies per status. Everything else (table labels, sign-off) is shared.
 */
const statusCopy: Record<
  Locale,
  Record<
    NotifiableOrderStatus,
    {
      subject: (orderNumber: string) => string;
      title: string;
      message: string;
      followUp: string;
      statusLabel: string;
      thankYou: string;
      footer: string;
      updatedOn: string;
    }
  >
> = {
  en: {
    pending: {
      subject: (orderNumber) => `Order Under Review: ${orderNumber}`,
      title: "Order Under Review",
      message:
        "Your order has been placed back under review and is awaiting confirmation from our team.",
      followUp:
        "We will contact you as soon as the review is complete. No action is required from you in the meantime.",
      statusLabel: "Pending",
      thankYou:
        "Thank you for choosing Elegardens. We appreciate your business!",
      footer:
        "This is an automated notification email. Please do not reply to this message.",
      updatedOn: "Status updated on:",
    },
    confirmed: {
      subject: (orderNumber) => `Order Confirmed: ${orderNumber}`,
      title: "Order Confirmed!",
      message:
        "We're happy to inform you that your order has been reviewed and confirmed.",
      followUp:
        "Our team will now proceed with processing your order. You will be notified once it is shipped.",
      statusLabel: "Confirmed",
      thankYou:
        "Thank you for choosing Elegardens. We appreciate your business!",
      footer:
        "This is an automated confirmation email. Please do not reply to this message.",
      updatedOn: "Order confirmed on:",
    },
    processing: {
      subject: (orderNumber) => `Order In Processing: ${orderNumber}`,
      title: "Your Order Is Being Processed",
      message:
        "Your order has moved into processing. Our team is preparing your items for delivery.",
      followUp:
        "We will notify you again as soon as your order is complete and on its way.",
      statusLabel: "Processing",
      thankYou:
        "Thank you for choosing Elegardens. We appreciate your business!",
      footer:
        "This is an automated notification email. Please do not reply to this message.",
      updatedOn: "Status updated on:",
    },
    completed: {
      subject: (orderNumber) => `Order Completed: ${orderNumber}`,
      title: "Your Order Is Complete",
      message: "Your order has been completed and is on its way to you.",
      followUp:
        "If anything is missing or not as expected, please contact us and we will put it right.",
      statusLabel: "Completed",
      thankYou:
        "Thank you for choosing Elegardens. We appreciate your business!",
      footer:
        "This is an automated notification email. Please do not reply to this message.",
      updatedOn: "Order completed on:",
    },
    cancelled: {
      subject: (orderNumber) => `Order Cancelled: ${orderNumber}`,
      title: "Your Order Has Been Cancelled",
      message:
        "We're writing to let you know that the order below has been cancelled.",
      followUp:
        "If this was unexpected, or if you would like to place the order again, please contact us and we will help you right away.",
      statusLabel: "Cancelled",
      thankYou: "We hope to serve you again soon.",
      footer:
        "This is an automated notification email. Please do not reply to this message.",
      updatedOn: "Order cancelled on:",
    },
  },
  de: {
    pending: {
      subject: (orderNumber) => `Bestellung in Prüfung: ${orderNumber}`,
      title: "Bestellung in Prüfung",
      message:
        "Ihre Bestellung wurde erneut zur Prüfung gestellt und wartet auf die Bestätigung durch unser Team.",
      followUp:
        "Wir melden uns bei Ihnen, sobald die Prüfung abgeschlossen ist. In der Zwischenzeit ist von Ihrer Seite nichts zu tun.",
      statusLabel: "In Prüfung",
      thankYou:
        "Vielen Dank, dass Sie Elegardens gewählt haben. Wir schätzen Ihr Geschäft!",
      footer:
        "Dies ist eine automatische Benachrichtigungs-E-Mail. Bitte antworten Sie nicht auf diese Nachricht.",
      updatedOn: "Status aktualisiert am:",
    },
    confirmed: {
      subject: (orderNumber) => `Bestellung bestätigt: ${orderNumber}`,
      title: "Bestellung bestätigt!",
      message:
        "Wir freuen uns, Ihnen mitteilen zu können, dass Ihre Bestellung geprüft und bestätigt wurde.",
      followUp:
        "Unser Team wird nun mit der Bearbeitung Ihrer Bestellung fortfahren. Sie werden benachrichtigt, sobald sie versandt wurde.",
      statusLabel: "Bestätigt",
      thankYou:
        "Vielen Dank, dass Sie Elegardens gewählt haben. Wir schätzen Ihr Geschäft!",
      footer:
        "Dies ist eine automatische Bestätigungs-E-Mail. Bitte antworten Sie nicht auf diese Nachricht.",
      updatedOn: "Bestellung bestätigt am:",
    },
    processing: {
      subject: (orderNumber) => `Bestellung in Bearbeitung: ${orderNumber}`,
      title: "Ihre Bestellung wird bearbeitet",
      message:
        "Ihre Bestellung befindet sich jetzt in Bearbeitung. Unser Team bereitet Ihre Artikel für die Lieferung vor.",
      followUp:
        "Wir benachrichtigen Sie erneut, sobald Ihre Bestellung abgeschlossen ist und sich auf dem Weg zu Ihnen befindet.",
      statusLabel: "In Bearbeitung",
      thankYou:
        "Vielen Dank, dass Sie Elegardens gewählt haben. Wir schätzen Ihr Geschäft!",
      footer:
        "Dies ist eine automatische Benachrichtigungs-E-Mail. Bitte antworten Sie nicht auf diese Nachricht.",
      updatedOn: "Status aktualisiert am:",
    },
    completed: {
      subject: (orderNumber) => `Bestellung abgeschlossen: ${orderNumber}`,
      title: "Ihre Bestellung ist abgeschlossen",
      message:
        "Ihre Bestellung wurde abgeschlossen und ist auf dem Weg zu Ihnen.",
      followUp:
        "Sollte etwas fehlen oder nicht Ihren Erwartungen entsprechen, kontaktieren Sie uns bitte – wir kümmern uns darum.",
      statusLabel: "Abgeschlossen",
      thankYou:
        "Vielen Dank, dass Sie Elegardens gewählt haben. Wir schätzen Ihr Geschäft!",
      footer:
        "Dies ist eine automatische Benachrichtigungs-E-Mail. Bitte antworten Sie nicht auf diese Nachricht.",
      updatedOn: "Bestellung abgeschlossen am:",
    },
    cancelled: {
      subject: (orderNumber) => `Bestellung storniert: ${orderNumber}`,
      title: "Ihre Bestellung wurde storniert",
      message:
        "Wir möchten Sie darüber informieren, dass die unten aufgeführte Bestellung storniert wurde.",
      followUp:
        "Falls dies unerwartet kommt oder Sie die Bestellung erneut aufgeben möchten, kontaktieren Sie uns bitte – wir helfen Ihnen umgehend weiter.",
      statusLabel: "Storniert",
      thankYou: "Wir hoffen, Sie bald wieder bedienen zu dürfen.",
      footer:
        "Dies ist eine automatische Benachrichtigungs-E-Mail. Bitte antworten Sie nicht auf diese Nachricht.",
      updatedOn: "Bestellung storniert am:",
    },
  },
};

/**
 * Labels shared by every status email
 */
const sharedTranslations = {
  en: {
    greeting: (companyName: string) => `Dear ${companyName},`,
    orderSummary: "Order Details",
    orderNumber: "Order Number:",
    orderDate: "Order Date:",
    deliveryDate: "Delivery Date:",
    status: "Status:",
    orderItems: "Order Items",
    productId: "Product ID",
    productName: "Product Name",
    quantity: "Quantity",
    bestRegards: "Best regards,",
    teamName: "The Elegardens Team",
  },
  de: {
    greeting: (companyName: string) => `Sehr geehrte ${companyName},`,
    orderSummary: "Bestelldetails",
    orderNumber: "Bestellnummer:",
    orderDate: "Bestelldatum:",
    deliveryDate: "Lieferdatum:",
    status: "Status:",
    orderItems: "Bestellpositionen",
    productId: "Produkt-ID",
    productName: "Produktname",
    quantity: "Menge",
    bestRegards: "Mit freundlichen Grüßen,",
    teamName: "Das Elegardens Team",
  },
};

/**
 * Subject line for an order status notification
 */
export function getOrderStatusSubject(
  orderNumber: string,
  status: NotifiableOrderStatus,
  locale: Locale = "en",
): string {
  return statusCopy[locale][status].subject(orderNumber);
}

/**
 * Generate HTML email template for an order status change
 */
export function generateOrderStatusChangedHTML(
  data: EmailTemplateData,
  status: NotifiableOrderStatus,
  locale: Locale = "en",
): string {
  const { order } = data;
  const t = sharedTranslations[locale];
  const s = statusCopy[locale][status];

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
  const updatedDate = new Date().toLocaleString(dateFormat, {
    dateStyle: "long",
    timeStyle: "short",
  });

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #6a844a; border-bottom: 2px solid #6a844a; padding-bottom: 10px; margin-bottom: 20px;">
        ${escapeHtml(s.title)}
      </h1>

      <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        ${escapeHtml(t.greeting(data.client.companyName))}
      </p>

      <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        ${escapeHtml(s.message)}
      </p>

      <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        ${escapeHtml(s.followUp)}
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
            <td style="padding: 8px 0; color: #333;">${escapeHtml(s.statusLabel)}</td>
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
        ${escapeHtml(s.thankYou)}
      </p>

      <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 10px;">
        ${escapeHtml(t.bestRegards)}<br>
        <strong>${escapeHtml(t.teamName)}</strong>
      </p>

      <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        ${escapeHtml(s.footer)}<br>
        ${escapeHtml(s.updatedOn)} ${escapeHtml(updatedDate)}
      </p>
    </div>
  `;
}

/**
 * Generate plain text email template for an order status change
 */
export function generateOrderStatusChangedText(
  data: EmailTemplateData,
  status: NotifiableOrderStatus,
  locale: Locale = "en",
): string {
  const { order } = data;
  const t = sharedTranslations[locale];
  const s = statusCopy[locale][status];

  const itemsList = order.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.itemName} (ID: ${item.itemId}) - ${t.quantity}: ${item.quantity}`,
    )
    .join("\n");

  const dateFormat = locale === "de" ? "de-DE" : "en-US";
  const updatedDate = new Date().toLocaleString(dateFormat, {
    dateStyle: "long",
    timeStyle: "short",
  });

  return `
${s.title}

${t.greeting(data.client.companyName)}

${s.message}

${s.followUp}

${t.orderSummary}:
${t.orderNumber} ${order.orderNumber}
${t.orderDate} ${order.orderDate || new Date().toLocaleDateString(dateFormat)}
${t.deliveryDate} ${order.deliveryDate}
${t.status} ${s.statusLabel}

${t.orderItems}:
${itemsList}

${s.thankYou}

${t.bestRegards}
${t.teamName}

---
${s.footer}
${s.updatedOn} ${updatedDate}
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
