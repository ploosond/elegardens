import type { Order } from "@/payload-types";

/**
 * Order item structure for email templates
 */
export interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
}

/**
 * Client data structure for email templates
 */
export interface ClientEmailData {
  id: number;
  clientId: string;
  companyName: string;
  email: string;
  contactPerson?: string | null;
  phone?: string | null;
  address?: string;
}

/**
 * Order data structure for email templates
 */
export interface OrderEmailData {
  id: number;
  orderNumber: string;
  orderDate?: string | null;
  deliveryDate: string;
  status: Order["status"];
  items: OrderItem[];
  notes?: string | null;
  companyName: string;
}

/**
 * Complete data structure for email templates
 */
export interface EmailTemplateData {
  order: OrderEmailData;
  client: ClientEmailData;
  adminPanelUrl: string;
}
