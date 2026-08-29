import type { CollectionConfig } from "payload";
import {
  sendOrderEmails,
  sendOrderStatusEmail,
} from "@/lib/email/order-email-service";
import { isNotifiableOrderStatus } from "@/lib/email/templates/order-status-changed";
// Admin RowLabel component is referenced via import map string

// Helper function to get ISO week number
function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// Helper function to format date as YYYYMMDD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "orderNumber",
    defaultColumns: [
      "orderNumber",
      "client",
      "companyName",
      "status",
      "createdAt",
    ],
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Store previous status for status change detection
        if (operation === "update" && data.id) {
          try {
            const previousOrder = await req.payload.findByID({
              collection: "orders",
              id: data.id,
            });
            // Store previous status in request context for use in afterChange
            (req as any).previousOrderStatus = previousOrder?.status;
          } catch (error) {
            console.error("Error fetching previous order status:", error);
          }
        }
        if (!data.orderNumber && operation === "create") {
          const payload = req.payload;

          // Get client information
          let clientId = "ACME"; // Default fallback
          if (data.client) {
            const client = await req.payload.findByID({
              collection: "clients",
              id:
                typeof data.client === "object" ? data.client.id : data.client,
            });
            if (client?.clientId) {
              clientId = client.clientId;
            }
            // Also set companyName if not already set
            if (!data.companyName && client?.companyName) {
              data.companyName = client.companyName;
            }
          }

          // Get current date and calculate week number
          const now = new Date();
          const weekNumber = getWeekNumber(now);
          const dateStr = formatDate(now);
          const weekStr = `W${String(weekNumber).padStart(2, "0")}`;

          // Build the prefix to search for existing orders
          const orderPrefix = `${clientId}-${weekStr}-${dateStr}-`;

          // Find existing orders with the same client, week, and date
          const existingOrders = await payload.find({
            collection: "orders",
            where: {
              orderNumber: {
                contains: orderPrefix,
              },
            },
            limit: 1000, // Get all orders for this client/week/date to count properly
            sort: "-orderNumber",
          });

          // Extract order count from existing orders
          let orderCount = 1;
          if (existingOrders.docs.length > 0) {
            // Find the highest order count for this prefix
            const counts = existingOrders.docs
              .map((order) => {
                if (!order.orderNumber) return 0;
                const match = order.orderNumber.match(
                  new RegExp(
                    `${orderPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\d+)`,
                  ),
                );
                return match ? parseInt(match[1], 10) : 0;
              })
              .filter((count) => count > 0);

            if (counts.length > 0) {
              orderCount = Math.max(...counts) + 1;
            }
          }

          // Generate order number: ACME-W03-20260116-001
          data.orderNumber = `${orderPrefix}${String(orderCount).padStart(3, "0")}`;
        }

        // Set companyName if not already set
        if (!data.companyName && data.client) {
          const client = await req.payload.findByID({
            collection: "clients",
            id: typeof data.client === "object" ? data.client.id : data.client,
          });
          if (client?.companyName) {
            data.companyName = client.companyName;
          }
        }

        // Set orderDate if not already set
        if (!data.orderDate && operation === "create") {
          data.orderDate = new Date().toISOString().split("T")[0];
        }

        return data;
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === "create" && doc) {
          try {
            const payload = req.payload;

            // Get client data
            let clientData = null;
            if (doc.client) {
              const clientId =
                typeof doc.client === "object" ? doc.client.id : doc.client;
              clientData = await payload.findByID({
                collection: "clients",
                id: clientId,
              });
            }

            // Get locale from order (default to 'en' for backward compatibility)
            const locale = (doc.locale === "de" || doc.locale === "en"
              ? doc.locale
              : "en") as "en" | "de";

            // Send emails if client data is available
            if (clientData) {
              await sendOrderEmails(
                payload,
                doc as any,
                clientData as any,
                locale,
              );
            } else {
              console.warn(
                "Client data not found for order, skipping email notification",
              );
            }
          } catch (error) {
            console.error("Error sending order notification emails:", error);
            // Don't fail the order creation if email fails
          }
        } else if (operation === "update" && doc) {
          // Check if status changed to 'confirmed'
          try {
            const payload = req.payload;

            // Get previous status from request context (set in beforeChange)
            const previousStatus = (req as any).previousOrderStatus as
              | string
              | undefined;
            const currentStatus = doc.status as string;

            // Notify the client on every status change. previousStatus is
            // undefined when the beforeChange lookup failed - skip rather than
            // risk re-sending a notification for an unchanged status.
            if (
              previousStatus !== undefined &&
              currentStatus !== previousStatus &&
              isNotifiableOrderStatus(currentStatus)
            ) {
              // Get client data
              let clientData = null;
              if (doc.client) {
                const clientId =
                  typeof doc.client === "object" ? doc.client.id : doc.client;
                clientData = await payload.findByID({
                  collection: "clients",
                  id: clientId,
                });
              }

              if (clientData) {
                // Get locale from order (default to 'en' for backward compatibility)
                const locale = (doc.locale === "de" || doc.locale === "en"
                  ? doc.locale
                  : "en") as "en" | "de";

                await sendOrderStatusEmail(
                  payload,
                  doc as any,
                  clientData as any,
                  currentStatus,
                  locale,
                );
              } else {
                console.warn(
                  "Client data not found for order, skipping status email",
                );
              }
            }
          } catch (error) {
            console.error(
              "Error sending order confirmation email:",
              error,
            );
            // Don't fail the order update if email fails
          }
        }
      },
    ],
  },
  access: {
    create: ({ req: { user } }) => {
      // Clients can create their own orders, admins can create any
      if (user?.collection === "users") return true;
      if (user?.collection === "clients") return true;
      return false;
    },
    read: ({ req: { user } }) => {
      // Admins can read all, clients can only read their own
      if (user?.collection === "users") return true;
      if (user?.collection === "clients") {
        return {
          client: {
            equals: user.id,
          },
        };
      }
      return false;
    },
    update: ({ req: { user } }) => {
      // Only admins can update orders
      return user?.collection === "users";
    },
    delete: ({ req: { user } }) => {
      // Only admins can delete orders
      return user?.collection === "users";
    },
  },
  fields: [
    {
      name: "orderNumber",
      type: "text",
      required: true,
      unique: true,
      label: "Order Number",
      admin: {
        readOnly: true,
      },
    },
    {
      name: "client",
      type: "relationship",
      relationTo: "clients",
      required: true,
      label: "Client",
      admin: {},
    },
    {
      name: "companyName",
      type: "text",
      required: true,
      label: "Company Name",
      admin: {},
    },
    {
      name: "orderDate",
      type: "text",
      label: "Order Date",
      admin: {
        placeholder: "2026-01-23",
        readOnly: true,
      },
    },
    {
      name: "deliveryDate",
      type: "text",
      required: true,
      label: "Delivery Date",
      admin: {
        description: "Requested delivery date (client input)",
        placeholder: "2024-01-15",
      },
    },
    {
      name: "items",
      type: "array",
      required: true,
      label: "Order Items",
      minRows: 1,
      admin: {},
      fields: [
        {
          name: "itemId",
          type: "text",
          label: "Item ID",
          required: true,
          admin: {},
        },
        {
          name: "itemName",
          type: "text",
          label: "Item Name",
          required: true,
          admin: {},
        },
        {
          name: "quantity",
          type: "number",
          required: true,
          label: "Quantity",
          min: 1,
          admin: {},
        },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      label: "Order Status",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Processing", value: "processing" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ],
      admin: {
        description: "Current order status",
      },
    },
    {
      name: "notes",
      type: "textarea",
      label: "Client Notes",
      admin: {
        description: "Notes from client with order",
        rows: 3,
      },
    },
    {
      name: "adminNotes",
      type: "textarea",
      label: "Admin Notes",
      admin: {
        description: "Internal admin notes",
        rows: 3,
      },
    },
    {
      name: "locale",
      type: "select",
      label: "Order Language",
      defaultValue: "en",
      options: [
        { label: "English", value: "en" },
        { label: "German", value: "de" },
      ],
      admin: {
        description: "Language used when order was created",
        readOnly: true,
      },
    },
  ],
};
