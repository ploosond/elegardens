import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'client', 'companyName', 'status', 'createdAt'],
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Auto-generate orderNumber if not provided
        if (!data.orderNumber && operation === 'create') {
          const payload = req.payload
          const year = new Date().getFullYear()
          
          // Find the highest order number for this year
          const existingOrders = await payload.find({
            collection: 'orders',
            where: {
              orderNumber: {
                contains: `ORD-${year}-`,
              },
            },
            limit: 1,
            sort: '-orderNumber',
          })

          let nextNumber = 1
          if (existingOrders.docs.length > 0 && existingOrders.docs[0].orderNumber) {
            const lastOrderNumber = existingOrders.docs[0].orderNumber
            const match = lastOrderNumber.match(/ORD-\d{4}-(\d+)/)
            if (match) {
              nextNumber = parseInt(match[1], 10) + 1
            }
          }

          data.orderNumber = `ORD-${year}-${String(nextNumber).padStart(3, '0')}`
        }

        // Auto-populate companyName from client if not provided
        if (!data.companyName && data.client) {
          const client = await req.payload.findByID({
            collection: 'clients',
            id: typeof data.client === 'object' ? data.client.id : data.client,
          })
          if (client && client.companyName) {
            data.companyName = client.companyName
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Send email notification to admin on order creation
        if (operation === 'create' && doc) {
          try {
            const payload = req.payload

            // Get client details
            let clientData = null
            if (doc.client) {
              const clientId = typeof doc.client === 'object' ? doc.client.id : doc.client
              clientData = await payload.findByID({
                collection: 'clients',
                id: clientId,
              })
            }

            // Get product details for items
            const itemsWithDetails = await Promise.all(
              (doc.items || []).map(async (item: any) => {
                if (item.product) {
                  const productId = typeof item.product === 'object' ? item.product.id : item.product
                  const product = await payload.findByID({
                    collection: 'products',
                    id: productId,
                  })
                  return {
                    ...item,
                    productName: product?.common_name || 'Unknown Product',
                    productId: product?.productId || 'N/A',
                  }
                }
                return item
              })
            )

            // Prepare email content
            const adminEmail = process.env.CONTACT_FORM_RECIPIENT || process.env.SMTP_USER || 'admin@elegardens.com'
            
            const emailSubject = `New Order Received: ${doc.orderNumber}`
            const emailBody = `
New order has been received:

Order Number: ${doc.orderNumber}
Client: ${clientData?.companyName || 'N/A'} (${clientData?.clientId || 'N/A'})
Contact: ${clientData?.email || 'N/A'} | ${clientData?.phone || 'N/A'}
Order Date: ${doc.orderDate || 'N/A'}
Delivery Date: ${doc.deliveryDate || 'N/A'}

Items:
${itemsWithDetails.map((item: any, index: number) => 
  `${index + 1}. ${item.productName} (ID: ${item.productId}) - Quantity: ${item.quantity}`
).join('\n')}

${doc.notes ? `Client Notes: ${doc.notes}` : ''}

View order in admin: ${process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'}/admin/collections/orders/${doc.id}
            `.trim()

            // Send email using Payload's email adapter
            await payload.email.sendEmail({
              to: adminEmail,
              subject: emailSubject,
              html: emailBody.replace(/\n/g, '<br>'),
            })
          } catch (error) {
            console.error('Error sending order notification email:', error)
            // Don't fail the order creation if email fails
          }
        }
      },
    ],
  },
  access: {
    create: ({ req: { user } }) => {
      // Clients can create their own orders, admins can create any
      if (user?.collection === 'users') return true
      if (user?.collection === 'clients') return true
      return false
    },
    read: ({ req: { user } }) => {
      // Admins can read all, clients can only read their own
      if (user?.collection === 'users') return true
      if (user?.collection === 'clients') {
        return {
          client: {
            equals: user.id,
          },
        }
      }
      return false
    },
    update: ({ req: { user } }) => {
      // Only admins can update orders
      return user?.collection === 'users'
    },
    delete: ({ req: { user } }) => {
      // Only admins can delete orders
      return user?.collection === 'users'
    },
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'Order Number',
      admin: {
        description: 'Auto-generated order number',
        readOnly: true,
      },
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
      label: 'Client',
      admin: {
        description: 'Client who placed this order',
      },
    },
    {
      name: 'companyName',
      type: 'text',
      required: true,
      label: 'Company Name',
      admin: {
        description: 'Auto-populated from client',
      },
    },
    {
      name: 'orderDate',
      type: 'text',
      label: 'Order Date (Week-Date)',
      admin: {
        description: 'Order date in format: week number-date (e.g., 21-0107)',
        placeholder: '21-0107',
      },
    },
    {
      name: 'deliveryDate',
      type: 'text',
      required: true,
      label: 'Delivery Date',
      admin: {
        description: 'Requested delivery date (client input)',
        placeholder: '2024-01-15',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      label: 'Order Items',
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          label: 'Product',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          label: 'Quantity',
          min: 1,
          admin: {
            description: 'Quantity ordered',
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Order Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        description: 'Current order status',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Client Notes',
      admin: {
        description: 'Notes from client with order',
        rows: 3,
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        description: 'Internal admin notes',
        rows: 3,
      },
    },
  ],
}
