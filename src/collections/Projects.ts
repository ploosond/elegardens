import type { CollectionConfig } from "payload";

export const Projects: CollectionConfig = {
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc, collection }) => {
        // Auto-increment position if not set
        if (typeof data.position !== "number" || data.position === 0) {
          // Find max position in the collection
          const results = await req.payload.find({
            collection: "projects",
            limit: 1,
            sort: "-position",
            depth: 0,
          });
          const maxPosition = results?.docs?.[0]?.position || 0;
          data.position = maxPosition + 1;
        }

        // Helper to get first paragraph text
        const getFirstParagraph = (lang: string) => {
          if (Array.isArray(data.sections)) {
            for (const block of data.sections) {
              if (
                block.blockType === "text-block" &&
                Array.isArray(block.paragraphs) &&
                block.paragraphs.length > 0
              ) {
                return block.paragraphs[0][`text_${lang}`] || "";
              }
            }
          }
          return "";
        };

        // Auto-generate SEO fields if empty
        if (!data.metaTitle_en && data.title_en) {
          data.metaTitle_en = data.title_en;
        }
        if (!data.metaTitle_de && data.title_de) {
          data.metaTitle_de = data.title_de;
        }
        if (!data.metaDescription_en) {
          data.metaDescription_en = getFirstParagraph("en");
        }
        if (!data.metaDescription_de) {
          data.metaDescription_de = getFirstParagraph("de");
        }
        return data;
      },
    ],
  },
  slug: "projects",
  admin: {
    useAsTitle: "title_en",
  },
  access: {
    read: () => true,
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
          localized: true,
          admin: {
            description:
              "bahnhof-path (lowercase, hyphens only, no spaces or special characters)",
            width: "50%",
            placeholder: "bahnhof-path",
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
          admin: {
            width: "50%",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "client",
          type: "text",
          required: true,
          label: "Client",
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
          name: "tagline_en",
          type: "text",
          label: "Tagline (English)",
          admin: { width: "50%" },
        },
        {
          name: "tagline_de",
          type: "text",
          label: "Tagline (German)",
          admin: { width: "50%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "category_en",
          type: "text",
          required: true,
          label: "Category (English)",
          admin: { width: "50%" },
        },
        {
          name: "category_de",
          type: "text",
          required: true,
          label: "Category (German)",
          admin: { width: "50%" },
        },
      ],
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Main Image",
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
