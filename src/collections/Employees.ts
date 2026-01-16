import type { CollectionConfig } from "payload";

export const Employees: CollectionConfig = {
  slug: "employees",

  admin: {
    useAsTitle: "last_name",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "first_name",
      type: "text",
      required: true,
      label: "First Name",
    },
    {
      name: "last_name",
      type: "text",
      required: true,
      label: "Last Name",
    },
    {
      name: "email",
      type: "email",
      label: "Email",
    },
    {
      name: "telephone",
      type: "text",
      label: "Telephone",
    },
    {
      name: "role_en",
      type: "text",
      label: "Role (EN)",
      required: true,
    },
    {
      name: "role_de",
      type: "text",
      label: "Role (DE)",
      required: true,
    },
    {
      name: "department_en",
      type: "text",
      label: "Department (EN)",
    },
    {
      name: "department_de",
      type: "text",
      label: "Department (DE)",
    },
    {
      name: "profilePicture",
      type: "upload",
      relationTo: "media",
      label: "Profile Picture",
    },
  ],
};
