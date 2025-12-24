import type { TextField } from 'payload'

export const ColorPicker = (overrides?: Omit<TextField, 'type'>): TextField => {
  const { name = 'color', label = 'Color', admin, ...rest } = overrides ?? {}

  return {
    type: 'text',
    name,
    label,
    admin: {
      ...admin,
      components: {
        Field: '@/components/payload/ColorPicker',
      },
    },
    ...rest,
  } as TextField
}
