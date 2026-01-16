import type { CollectionConfig } from "payload";
// Admin RowLabel component is referenced via import map string

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
        if (!data.orderNumber && operation === "create") {
          const payload = req.payload;
          const year = new Date().getFullYear();

          const existingOrders = await payload.find({
            collection: "orders",
            where: {
              orderNumber: {
                contains: `ORD-${year}-`,
              },
            },
            limit: 1,
            sort: "-orderNumber",
          });

          let nextNumber = 1;
          if (
            existingOrders.docs.length > 0 &&
            existingOrders.docs[0].orderNumber
          ) {
            const lastOrderNumber = existingOrders.docs[0].orderNumber;
            const match = lastOrderNumber.match(/ORD-\d{4}-(\d+)/);
            if (match) {
              nextNumber = parseInt(match[1], 10) + 1;
            }
          }

          data.orderNumber = `ORD-${year}-${String(nextNumber).padStart(3, "0")}`;
        }

        if (!data.companyName && data.client) {
          const client = await req.payload.findByID({
            collection: "clients",
            id: typeof data.client === "object" ? data.client.id : data.client,
          });
          if (client?.companyName) {
            data.companyName = client.companyName;
          }
        }

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

            let clientData = null;
            if (doc.client) {
              const clientId =
                typeof doc.client === "object" ? doc.client.id : doc.client;
              clientData = await payload.findByID({
                collection: "clients",
                id: clientId,
              });
            }

            const itemsWithDetails = (doc.items || []) as Array<{
              itemId?: string;
              itemName?: string;
              quantity: number;
            }>;

            const adminEmail =
              process.env.CONTACT_FORM_RECIPIENT ||
              process.env.SMTP_USER ||
              "admin@elegardens.com";

            const emailSubject = `New Order Received: ${doc.orderNumber}`;
            const emailBody = `
New order has been received:

Order Number: ${doc.orderNumber}
Client: ${clientData?.companyName || "N/A"} (${clientData?.clientId || "N/A"})
Contact: ${clientData?.email || "N/A"} | ${clientData?.phone || "N/A"}
Order Date: ${doc.orderDate || "N/A"}
Delivery Date: ${doc.deliveryDate || "N/A"}

Items:
${itemsWithDetails
  .map(
    (item, index) =>
      `${index + 1}. ${item.itemName || "Unknown"} (ID: ${item.itemId || "N/A"}) - Quantity: ${
        item.quantity
      }`,
  )
  .join("\n")}

${doc.notes ? `Client Notes: ${doc.notes}` : ""}

View order in admin: ${
              process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000"
            }/admin/collections/orders/${doc.id}
            `.trim();

            // Send email using Payload's email adapter
            await payload.email.sendEmail({
              to: adminEmail,
              subject: emailSubject,
              html: emailBody.replace(/\n/g, "<br>"),
            });
          } catch (error) {
            console.error("Error sending order notification email:", error);
            // Don't fail the order creation if email fails
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
  ],
};
