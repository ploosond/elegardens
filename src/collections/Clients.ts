import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  auth: true, // Payload will add email and password fields automatically
  admin: {
    useAsTitle: 'clientId',
    defaultColumns: ['clientId', 'companyName', 'email', 'status', 'updatedAt'],
  },
  hooks: {
    beforeLogin: [
      async ({ user, req }) => {
        // Check if client account is active before allowing login
        // The user object may not have all fields, so we fetch the full client
        if (user?.id) {
          const fullClient = await req.payload.findByID({
            collection: 'clients',
            id: user.id,
          })

          if (fullClient.status !== 'active') {
            throw new Error('Your account is inactive. Please contact support.')
          }
        }
        return user
      },
    ],
  },
  access: {
    create: ({ req: { user } }) => {
      // Only admins can create clients
      return user?.collection === 'users'
    },
    read: ({ req: { user } }) => {
      // Admins can read all, clients can only read their own
      if (user?.collection === 'users') return true
      if (user?.collection === 'clients') {
        return {
          id: {
            equals: user.id,
          },
        }
      }
      return false
    },
    update: ({ req: { user } }) => {
      // Admins can update all, clients can only update their own
      if (user?.collection === 'users') return true
      if (user?.collection === 'clients') {
        return {
          id: {
            equals: user.id,
          },
        }
      }
      return false
    },
    delete: ({ req: { user } }) => {
      // Only admins can delete clients
      return user?.collection === 'users'
    },
  },
  fields: [
    {
      name: 'clientId',
      type: 'text',
      required: true,
      unique: true,
      label: 'Client ID',
      admin: {
        placeholder: 'Client001',
      },
      validate: (value: any) => {
        if (!value) return 'Client ID is required'
        if (value.includes(' ')) return 'Client ID cannot contain spaces'
        return true
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: 'Email',
      admin: {
        description: 'Contact email address (also used for password reset)',
      },
    },
    {
      name: 'companyName',
      type: 'text',
      required: true,
      label: 'Company Name',
      admin: {
        placeholder: 'ABC Company Ltd.',
      },
    },
    {
      name: 'contactPerson',
      type: 'text',
      label: 'Contact Person',
      admin: {
        placeholder: 'John Doe',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone',
      admin: {
        placeholder: '+1 234 567 8900',
      },
    },
    {
      name: 'address',
      type: 'text',
      required: true,
      label: 'Address',
      admin: {
        placeholder: '123 Main Street\nCity, State ZIP\nCountry',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      label: 'Account Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      admin: {},
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        rows: 3,
      },
    },
  ],
}
