import type { GlobalConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const PrivacyPolicy: GlobalConfig = {
  slug: 'privacy-policy',
  label: 'Privacy Policy',
  access: {
    read: () => true,
  },
  fields: [
    // Policy Sections
    {
      name: 'sections',
      type: 'array',
      label: 'Policy Sections',
      minRows: 1,
      fields: [
        {
          name: 'title_en',
          type: 'text',
          label: 'Section Title (English)',
          required: true,
        },
        {
          name: 'title_de',
          type: 'text',
          label: 'Section Title (German)',
          required: true,
        },
        {
          name: 'content_en',
          type: 'richText',
          label: 'Section Content (English)',
          editor: lexicalEditor(),
          required: true,
        },
        {
          name: 'content_de',
          type: 'richText',
          label: 'Section Content (German)',
          editor: lexicalEditor(),
          required: true,
        },
      ],
    },
  ],
}

