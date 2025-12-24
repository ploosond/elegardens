import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'client',
      type: 'text',
      required: true,
      label: 'Client',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
      localized: true,
    },
    {
      name: 'category',
      type: 'text',
      label: 'Category',
      localized: true,
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
      localized: true,
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      label: 'Main Image',
    },
    {
      name: 'sections',
      type: 'json', // Was JSON in Prisma. Ideally convert to 'blocks' field type for CMS flexibility.
      label: 'Sections',
    },
    {
      name: 'displayRank',
      type: 'number',
      defaultValue: 0,
      label: 'Display Rank',
    },
  ],
}
