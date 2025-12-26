import type { CollectionConfig } from 'payload'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'consent', 'subscribedAt', 'status'],
    group: 'Content',
  },
  access: {
    read: () => true, // Allow reading for admin
    create: () => true, // Allow API to create subscribers
    update: () => true, // Allow admins to update
    delete: () => true, // Allow admins to delete
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
      label: 'Email',
      admin: {
        description: 'Subscriber email address',
      },
    },
    {
      name: 'consent',
      type: 'checkbox',
      defaultValue: true,
      label: 'Consent Given',
      admin: {
        description: 'User has given consent to receive newsletters',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'active',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Unsubscribed',
          value: 'unsubscribed',
        },
        {
          label: 'Bounced',
          value: 'bounced',
        },
      ],
      admin: {
        description: 'Subscription status',
      },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      label: 'Subscribed At',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Date and time of subscription',
      },
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      label: 'Unsubscribed At',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Date and time of unsubscription (if applicable)',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        description: 'Internal notes about this subscriber',
        rows: 3,
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Set subscribedAt on create
        if (operation === 'create' && !data.subscribedAt) {
          data.subscribedAt = new Date().toISOString()
        }
        // Set unsubscribedAt when status changes to unsubscribed
        if (data.status === 'unsubscribed' && !data.unsubscribedAt) {
          data.unsubscribedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
}

