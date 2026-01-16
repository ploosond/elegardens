import type { CollectionConfig } from "payload";

export const Blogs: CollectionConfig = {
  slug: "blogs",
  admin: {
    useAsTitle: "title_en",
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        // Helper to trim and limit string length
        const trimTo = (str: string, len: number) =>
          str ? str.substring(0, len).trim() : "";
        // English
        if (!data.metaTitle_en || data.metaTitle_en === "") {
          data.metaTitle_en = trimTo(data.title_en, 60);
        }
        if (!data.metaDescription_en || data.metaDescription_en === "") {
          data.metaDescription_en = trimTo(data.summary_en, 160);
        }
        // German
        if (!data.metaTitle_de || data.metaTitle_de === "") {
          data.metaTitle_de = trimTo(data.title_de, 60);
        }
        if (!data.metaDescription_de || data.metaDescription_de === "") {
          data.metaDescription_de = trimTo(data.summary_de, 160);
        }
        return data;
      },
    ],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          label: "Slug",
          admin: {
            description:
              "blog-post-title (lowercase, hyphens only, no spaces or special characters)",
            width: "50%",
            placeholder: "blog-post-title",
          },
          validate: (value: any) => {
            if (!value) return "Slug is required";
            const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
            if (!slugRegex.test(value)) {
              return "Slug must contain only lowercase letters, numbers, and hyphens (no spaces, umlauts, or special characters)";
            }
            return true;
          },
        },
        {
          name: "position",
          type: "number",
          defaultValue: 0,
          label: "Position",
          admin: { width: "50%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "title_en",
          type: "text",
          required: true,
          label: "Title (English)",
          admin: { width: "50%" },
        },
        {
          name: "title_de",
          type: "text",
          required: true,
          label: "Title (German)",
          admin: { width: "50%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "summary_en",
          type: "textarea",
          label: "Summary (English)",
          admin: { width: "50%" },
        },
        {
          name: "summary_de",
          type: "textarea",
          label: "Summary (German)",
          admin: { width: "50%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "author",
          type: "text",
          label: "Author",
          admin: { width: "50%" },
        },
        {
          name: "publishedDate",
          type: "date",
          label: "Published Date",
          admin: { width: "50%" },
        },
      ],
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: "Cover Image",
    },
    {
      name: "sections",
      type: "blocks",
      label: "Sections",
      blocks: [
        {
          slug: "text-block",
          labels: {
            singular: "Text Block",
            plural: "Text Blocks",
          },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "subtitle_en",
                  type: "text",
                  label: "Subtitle (English)",
                  admin: { width: "50%" },
                },
                {
                  name: "subtitle_de",
                  type: "text",
                  label: "Subtitle (German)",
                  admin: { width: "50%" },
                },
              ],
            },
            {
              name: "paragraphs",
              type: "array",
              label: "Paragraphs",
              required: true,
              minRows: 1,
              defaultValue: [{ text_en: "", text_de: "" }],
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "text_en",
                      type: "textarea",
                      label: "Paragraph (English)",
                      required: true,
                      admin: { width: "50%" },
                    },
                    {
                      name: "text_de",
                      type: "textarea",
                      label: "Paragraph (German)",
                      required: true,
                      admin: { width: "50%" },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          slug: "image-block",
          labels: {
            singular: "Image Block",
            plural: "Image Blocks",
          },
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              label: "Image",
              required: true,
            },
            {
              name: "caption_en",
              type: "text",
              label: "Caption (English)",
            },
            {
              name: "caption_de",
              type: "text",
              label: "Caption (German)",
            },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "SEO Settings (Optional)",
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "metaTitle_en",
              type: "text",
              label: "Meta Title (English)",
              admin: {
                width: "50%",
                placeholder: "Auto-generated if empty",
                description: "50-60 characters",
              },
            },
            {
              name: "metaTitle_de",
              type: "text",
              label: "Meta Title (German)",
              admin: {
                width: "50%",
                placeholder: "Auto-generated if empty",
                description: "50-60 characters",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "metaDescription_en",
              type: "textarea",
              label: "Meta Description (English)",
              admin: {
                rows: 2,
                width: "50%",
                placeholder: "Auto-generated if empty",
                description: "150-160 characters",
              },
            },
            {
              name: "metaDescription_de",
              type: "textarea",
              label: "Meta Description (German)",
              admin: {
                rows: 2,
                width: "50%",
                placeholder: "Auto-generated if empty",
                description: "150-160 characters",
              },
            },
          ],
        },
      ],
    },
  ],
};
