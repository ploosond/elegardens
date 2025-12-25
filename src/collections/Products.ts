import type { CollectionConfig } from 'payload'
import { ColorPicker } from '../fields/color'

export const Products: CollectionConfig = {
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (!data.metaTitle_en && data.common_name_en) {
          data.metaTitle_en = data.common_name_en
        }
        if (!data.metaDescription_en && data.description_en) {
          data.metaDescription_en = data.description_en
        }
        if (!data.metaTitle_de && data.common_name_de) {
          data.metaTitle_de = data.common_name_de
        }
        if (!data.metaDescription_de && data.description_de) {
          data.metaDescription_de = data.description_de
        }
        return data
      },
    ],
  },
  slug: 'products',
  admin: {
    useAsTitle: 'common_name_en',
    defaultColumns: ['common_name_en', 'slug', 'color', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          label: 'Slug',
          admin: {
            description: 'rose-bushy (lowercase, hyphens only, no spaces or special characters)',
            width: '50%',
            placeholder: 'rose-bush',
          },
          validate: (value: any) => {
            if (!value) return 'Slug is required'

            const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

            if (!slugRegex.test(value)) {
              return 'Slug must contain only lowercase letters, numbers, and hyphens (no spaces, umlauts, or special characters)'
            }

            return true
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'common_name_en',
          type: 'text',
          label: 'Product Name (English)',
          validate: (val: any, { siblingData }: any) => {
            if (!val && !siblingData?.common_name_de) {
              return 'At least one product name (English or German) is required.'
            }
            return true
          },
          admin: {
            width: '50%',
            placeholder: 'Rose Bush',
          },
        },
        {
          name: 'common_name_de',
          type: 'text',
          label: 'Product Name (German)',
          validate: (val: any, { siblingData }: any) => {
            if (!val && !siblingData?.common_name_en) {
              return 'At least one product name (English or German) is required.'
            }
            return true
          },
          admin: {
            width: '50%',
            placeholder: 'Rosenstrauch',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'description_en',
          type: 'textarea',
          label: 'Description (English)',
          required: true,
          admin: {
            rows: 4,
            width: '50%',
            placeholder:
              'A beautiful rose bush with vibrant red flowers, perfect for gardens and patios.',
          },
        },
        {
          name: 'description_de',
          type: 'textarea',
          label: 'Description (German)',
          required: true,
          admin: {
            rows: 4,
            width: '50%',
            placeholder:
              'Ein wunderschöner Rosenstrauch mit leuchtend roten Blüten, ideal für Gärten und Terrassen.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'height',
          type: 'text',
          label: 'Height',
          required: true,
          admin: {
            width: '33%',
            placeholder: '50-60',
          },
        },
        {
          name: 'diameter',
          type: 'text',
          label: 'Diameter',
          required: true,
          admin: {
            width: '33%',
            placeholder: '30-40',
          },
        },
        {
          name: 'hardiness',
          type: 'text',
          label: 'Hardiness Zone',
          required: true,
          admin: {
            width: '34%',
            placeholder: '-15',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'light_en',
          type: 'select',
          label: 'Light Requirements (English)',
          required: true,
          options: [
            { label: 'Full Sun', value: 'full-sun' },
            { label: 'Partial Sun', value: 'partial-sun' },
            { label: 'Partial Shade', value: 'partial-shade' },
            { label: 'Full Shade', value: 'full-shade' },
          ],
          admin: {
            width: '50%',
          },
        },
        {
          name: 'light_de',
          type: 'select',
          label: 'Light Requirements (German)',
          required: true,
          options: [
            { label: 'Volle Sonne', value: 'full-sun' },
            { label: 'Teilsonne', value: 'partial-sun' },
            { label: 'Halbschatten', value: 'partial-shade' },
            { label: 'Vollschatten', value: 'full-shade' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'images',
          type: 'upload',
          relationTo: 'media',
          label: 'Images',
          hasMany: true,
          maxRows: 6,
          admin: {
            description: 'Upload up to 6 product photos.',
            width: '50%',
          },
        },
        ColorPicker({
          name: 'color',
          label: 'Card Background Color',
          defaultValue: '#6a844a',
          admin: {
            description: 'Choose a card background color',
            width: '50%',
          },
        }),
      ],
    },

    {
      type: 'collapsible',
      label: 'SEO Settings (Optional)',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'metaTitle_en',
              type: 'text',
              label: 'Meta Title (English)',
              admin: {
                width: '50%',
                placeholder: 'Auto-generated if empty',
                description: '50-60 characters',
              },
            },
            {
              name: 'metaTitle_de',
              type: 'text',
              label: 'Meta Title (German)',
              admin: {
                width: '50%',
                placeholder: 'Auto-generated if empty',
                description: '50-60 characters',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'metaDescription_en',
              type: 'textarea',
              label: 'Meta Description (English)',
              admin: {
                rows: 2,
                width: '50%',
                placeholder: 'Auto-generated if empty',
                description: '150-160 characters',
              },
            },
            {
              name: 'metaDescription_de',
              type: 'textarea',
              label: 'Meta Description (German)',
              admin: {
                rows: 2,
                width: '50%',
                placeholder: 'Auto-generated if empty',
                description: '150-160 characters',
              },
            },
          ],
        },
      ],
    },
  ],
}
