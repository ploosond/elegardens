import { GlobalConfig } from 'payload'

export const Movie: GlobalConfig = {
  slug: 'upload-home-page-video',
  label: 'Home Page Feature Video',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'feature-video',
      type: 'upload',
      relationTo: 'media',
      label: 'Ele gardens feature video',
      required: false,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Video Title',
      required: false,
    },
  ],
}
