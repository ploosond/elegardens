import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstname', 'lastname', 'email', 'phone', 'createdAt'],
    group: 'Content',
  },
  access: {
    read: () => true, // Allow reading for admin
    create: () => true, // Allow API to create submissions
    update: () => false, // Don't allow updates
    delete: () => true, // Allow admins to delete
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstname',
          type: 'text',
          required: true,
          label: 'First Name',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'lastname',
          type: 'text',
          required: true,
          label: 'Last Name',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email',
      admin: {
        description: 'Contact email address',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone',
      admin: {
        description: 'Optional phone number',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Message',
      admin: {
        rows: 5,
        description: 'Message from the contact form',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'new',
      options: [
        {
          label: 'New',
          value: 'new',
        },
        {
          label: 'Read',
          value: 'read',
        },
        {
          label: 'Replied',
          value: 'replied',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      admin: {
        description: 'Status of the contact submission',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        description: 'Internal notes about this submission',
        rows: 3,
      },
    },
  ],
  timestamps: true,
}
