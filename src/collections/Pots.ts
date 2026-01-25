import type { CollectionConfig } from "payload";

export const Pots: CollectionConfig = {
  slug: "pots",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["potId", "name", "size", "availability", "updatedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "potId",
          type: "text",
          required: true,
          unique: true,
          label: "Pot ID",
          admin: {
            width: "25%",
            placeholder: "POT-001",
          },
        },
        {
          name: "name",
          type: "text",
          required: true,
          label: "Pot Name",
          admin: {
            width: "75%",
            placeholder: "sm, md, lg, xl, etc.",
            description:
              "Enter any name for the pot (e.g., sm, md, lg, xl, Small, Medium, etc.)",
          },
        },
      ],
    },
    {
      name: "size",
      type: "text",
      label: "Dimensions",
      admin: {
        description: "Enter dimensions in the format: 10cm x 10cm",
        placeholder: "10cm x 10cm",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "availability",
          type: "select",
          label: "Availability",
          required: true,
          defaultValue: "available",
          options: [
            { label: "Available", value: "available" },
            { label: "Out of Stock", value: "out-of-stock" },
          ],
          admin: {
            width: "50%",
          },
        },
        {
          name: "quantity",
          type: "number",
          label: "Quantity (Internal)",
          admin: {
            width: "50%",
          },
        },
      ],
    },
    {
      name: "images",
      type: "upload",
      relationTo: "media",
      label: "Images",
      hasMany: true,
      maxRows: 6,
      admin: {
        description: "Upload up to 6 pot images",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      admin: {
        rows: 3,
        placeholder: "Brief description of the pot...",
      },
    },
  ],
};
