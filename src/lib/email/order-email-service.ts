import type { Payload } from 'payload';
import type { Order, Client } from '@/payload-types';
import type {
  OrderEmailData,
  ClientEmailData,
  EmailTemplateData,
} from './types';
import {
  generateAdminOrderNotificationHTML,
  generateAdminOrderNotificationText,
} from './templates/admin-order-notification';
import {
  generateClientOrderConfirmationHTML,
  generateClientOrderConfirmationText,
} from './templates/client-order-confirmation';
import {
  generateOrderStatusChangedHTML,
  generateOrderStatusChangedText,
  getOrderStatusSubject,
  statusIncludesExcelAttachment,
  type NotifiableOrderStatus,
} from './templates/order-status-changed';
import { generateOrderExcel } from '../excel/order-excel-generator';

type Locale = 'en' | 'de';

/**
 * Transform Order document to OrderEmailData
 */
function transformOrderToEmailData(order: Order): OrderEmailData {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    orderDate: order.orderDate || null,
    deliveryDate: order.deliveryDate,
    status: order.status,
    items: order.items.map((item) => ({
      itemId: item.itemId,
      itemName: item.itemName,
      quantity: item.quantity,
    })),
    notes: order.notes || null,
    companyName: order.companyName,
  };
}

/**
 * Transform Client document to ClientEmailData
 */
function transformClientToEmailData(client: Client): ClientEmailData {
  return {
    id: client.id,
    clientId: client.clientId,
    companyName: client.companyName,
    email: client.email,
    contactPerson: client.contactPerson || null,
    phone: client.phone || null,
    address: client.address,
  };
}

/**
 * Send order confirmation emails (admin and client)
 * @param payload - Payload instance
 * @param order - Order document
 * @param client - Client document
 * @param locale - Locale for client email (defaults to 'en')
 * @returns Promise with success status
 */
export async function sendOrderEmails(
  payload: Payload,
  order: Order,
  client: Client,
  locale: Locale = 'en',
): Promise<{ adminEmailSent: boolean; clientEmailSent: boolean }> {
  const result = {
    adminEmailSent: false,
    clientEmailSent: false,
  };

  try {
    // Transform data for email templates
    const orderData = transformOrderToEmailData(order);
    const clientData = transformClientToEmailData(client);

    // Prepare template data
    const templateData: EmailTemplateData = {
      order: orderData,
      client: clientData,
      adminPanelUrl:
        process.env.SERVER_URL ||
        process.env.NEXT_PUBLIC_PAYLOAD_URL ||
        'http://localhost:3000',
    };

    // Generate Excel file
    let excelBuffer: Buffer | null = null;
    try {
      excelBuffer = await generateOrderExcel(orderData, clientData);
    } catch (excelError) {
      console.error('Error generating Excel file:', excelError);
      // Continue without attachment if Excel generation fails
    }

    // Prepare attachment if Excel was generated
    // Resend adapter expects: { filename, content: Buffer }
    const attachment = excelBuffer
      ? [
          {
            filename: `order-${order.orderNumber}.xlsx`,
            content: excelBuffer,
          },
        ]
      : undefined;

    // Send admin email
    try {
      const adminEmail = process.env.ORDERS_EMAIL_RECIPIENT;

      await payload.email.sendEmail({
        to: adminEmail,
        subject: `New Order Received: ${order.orderNumber}`,
        html: generateAdminOrderNotificationHTML(templateData),
        text: generateAdminOrderNotificationText(templateData),
        attachments: attachment,
      } as any); // Type assertion needed as Payload types may not include attachments

      result.adminEmailSent = true;
    } catch (adminError) {
      console.error('Error sending admin email:', adminError);
      // Don't throw - continue to try client email
    }

    // Send client confirmation email
    try {
      if (!client.email) {
        console.warn(
          'Client email not available, skipping client confirmation email',
        );
      } else {
        const subject =
          locale === 'de'
            ? `Bestellbestätigung: ${order.orderNumber}`
            : `Order Confirmation: ${order.orderNumber}`;

        await payload.email.sendEmail({
          to: client.email,
          subject,
          html: generateClientOrderConfirmationHTML(templateData, locale),
          text: generateClientOrderConfirmationText(templateData, locale),
          attachments: attachment,
        } as any); // Type assertion needed as Payload types may not include attachments

        result.clientEmailSent = true;
      }
    } catch (clientError) {
      console.error('Error sending client email:', clientError);
      // Don't throw - email failure shouldn't fail order creation
    }
  } catch (error) {
    console.error('Error in sendOrderEmails:', error);
    // Return partial results even if there was an error
  }

  return result;
}

/**
 * Send an order status notification email to the client when the order status changes
 * @param payload - Payload instance
 * @param order - Order document
 * @param client - Client document
 * @param status - Status the order just changed to
 * @param locale - Locale for email (defaults to 'en')
 * @returns Promise with success status
 */
export async function sendOrderStatusEmail(
  payload: Payload,
  order: Order,
  client: Client,
  status: NotifiableOrderStatus,
  locale: Locale = 'en',
): Promise<boolean> {
  try {
    if (!client.email) {
      console.warn(
        'Client email not available, skipping order status email',
      );
      return false;
    }

    // Transform data for email templates
    const orderData = transformOrderToEmailData(order);
    const clientData = transformClientToEmailData(client);

    // Prepare template data
    const templateData: EmailTemplateData = {
      order: orderData,
      client: clientData,
      adminPanelUrl:
        process.env.SERVER_URL ||
        process.env.NEXT_PUBLIC_PAYLOAD_URL ||
        'http://localhost:3000',
    };

    // Generate Excel file (only statuses that ship the order sheet)
    let excelBuffer: Buffer | null = null;
    if (statusIncludesExcelAttachment(status)) {
      try {
        excelBuffer = await generateOrderExcel(orderData, clientData);
      } catch (excelError) {
        console.error('Error generating Excel file:', excelError);
        // Continue without attachment if Excel generation fails
      }
    }

    // Prepare attachment if Excel was generated
    // Resend adapter expects: { filename, content: Buffer }
    const attachment = excelBuffer
      ? [
          {
            filename: `order-${order.orderNumber}.xlsx`,
            content: excelBuffer,
          },
        ]
      : undefined;

    await payload.email.sendEmail({
      to: client.email,
      subject: getOrderStatusSubject(order.orderNumber, status, locale),
      html: generateOrderStatusChangedHTML(templateData, status, locale),
      text: generateOrderStatusChangedText(templateData, status, locale),
      attachments: attachment,
    } as any); // Type assertion needed as Payload types may not include attachments

    return true;
  } catch (error) {
    console.error('Error sending order status email:', error);
    return false;
  }
}
