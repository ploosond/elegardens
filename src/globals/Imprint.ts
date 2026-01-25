import type { GlobalConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

export const Imprint: GlobalConfig = {
  slug: 'imprint',
  label: 'Imprint (Impressum)',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'sections',
      type: 'array',
      label: 'Imprint Sections',
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
};
