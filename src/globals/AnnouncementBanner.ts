import type { GlobalConfig } from 'payload'
import { ColorPicker } from '@/fields/color'

export const AnnouncementBanner: GlobalConfig = {
  slug: 'announcement-banner',
  label: 'Announcement Banner',
  versions: {
    drafts: false,
  },
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable Banner',
      defaultValue: false,
    },
    {
      name: 'announcements',
      type: 'array',
      label: 'Announcements',
      required: false,
      admin: {
        description:
          'Add multiple announcements. Each announcement has both English and German text side by side.',
      },

      fields: [
        {
          name: 'text_en',
          type: 'text',
          label: 'Announcement Text (English)',
          required: false,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'text_de',
          type: 'text',
          label: 'Announcement Text (German)',
          required: false,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    ColorPicker({
      name: 'backgroundColor',
      label: 'Background Color',
      defaultValue: '#0b7a43',
      admin: {
        description: 'Background color of the banner (hex format, e.g., #0b7a43)',
      },
    }),
    ColorPicker({
      name: 'textColor',
      label: 'Text Color',
      defaultValue: '#ffffff',
      admin: {
        description: 'Text color of the banner (hex format, e.g., #ffffff)',
      },
    }),
    {
      name: 'fontWeight',
      type: 'select',
      label: 'Font Weight',
      defaultValue: 'bold',
      options: [
        {
          label: 'Semi Bold',
          value: 'semibold',
        },
        {
          label: 'Bold',
          value: 'bold',
        },
        {
          label: 'Extra Bold',
          value: 'extrabold',
        },
      ],
      admin: {
        description:
          'Semi Bold: Subtle emphasis. Bold: Recommended for most announcements. Extra Bold: Maximum visibility for urgent messages.',
      },
    },
    {
      name: 'showOnDesktop',
      type: 'checkbox',
      label: 'Show on Desktop',
      defaultValue: true,
      admin: {
        description: 'Display banner on desktop devices (md breakpoint and above)',
      },
    },
    {
      name: 'showOnMobile',
      type: 'checkbox',
      label: 'Show on Mobile',
      defaultValue: true,
      admin: {
        description: 'Display banner on mobile devices (below md breakpoint)',
      },
    },
    {
      name: 'speed',
      type: 'select',
      label: 'Animation Speed',
      defaultValue: 'medium',
      options: [
        {
          label: 'Slow',
          value: 'slow',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Fast',
          value: 'fast',
        },
      ],
      admin: {
        description: 'Speed of the scrolling animation',
      },
    },
  ],
}
