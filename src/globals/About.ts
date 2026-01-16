import type { GlobalConfig } from "payload";

export const About: GlobalConfig = {
  slug: "about",
  label: "About Page",
  access: {
    read: () => true,
  },
  fields: [
    // Roots fields
    {
      name: "roots_title_en",
      type: "text",
      label: "Roots Title (English)",
      required: true,
    },
    {
      name: "roots_title_de",
      type: "text",
      label: "Roots Title (German)",
      required: true,
    },
    {
      name: "roots_intro_en",
      type: "textarea",
      label: "Roots Intro (English)",
      required: true,
    },
    {
      name: "roots_intro_de",
      type: "textarea",
      label: "Roots Intro (German)",
      required: true,
    },
    {
      name: "roots_signature_en",
      type: "text",
      label: "Roots Signature (English)",
    },
    {
      name: "roots_signature_de",
      type: "text",
      label: "Roots Signature (German)",
    },
    // Milestones section title
    {
      name: "milestones_title_en",
      type: "text",
      label: "Milestones Section Title (English)",
      required: false,
    },
    {
      name: "milestones_title_de",
      type: "text",
      label: "Milestones Section Title (German)",
      required: false,
    },
    // Milestones array
    {
      name: "milestones",
      type: "array",
      label: "Milestones",
      fields: [
        {
          name: "title_en",
          type: "text",
          label: "Title (English)",
          required: true,
        },
        {
          name: "title_de",
          type: "text",
          label: "Title (German)",
          required: true,
        },
        {
          name: "subtitle1_en",
          type: "text",
          label: "Subtitle 1 (English)",
        },
        {
          name: "subtitle1_de",
          type: "text",
          label: "Subtitle 1 (German)",
        },
        {
          name: "desc1_en",
          type: "textarea",
          label: "Description 1 (English)",
        },
        {
          name: "desc1_de",
          type: "textarea",
          label: "Description 1 (German)",
        },
        {
          name: "subtitle2_en",
          type: "text",
          label: "Subtitle 2 (English)",
        },
        {
          name: "subtitle2_de",
          type: "text",
          label: "Subtitle 2 (German)",
        },
        {
          name: "desc2_en",
          type: "textarea",
          label: "Description 2 (English)",
        },
        {
          name: "desc2_de",
          type: "textarea",
          label: "Description 2 (German)",
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Milestone Image",
        },
      ],
    },
    // Our Story section title
    {
      name: "our_story_title_en",
      type: "text",
      label: "Our Story Title (English)",
      required: false,
    },
    {
      name: "our_story_title_de",
      type: "text",
      label: "Our Story Title (German)",
      required: false,
    },
    // CEO, mission, vision, values fields
    {
      name: "ceo_title_en",
      type: "text",
      label: "CEO Title (English)",
    },
    {
      name: "ceo_title_de",
      type: "text",
      label: "CEO Title (German)",
    },
    {
      name: "ceo_desc_en",
      type: "textarea",
      label: "CEO Description (English)",
    },
    {
      name: "ceo_desc_de",
      type: "textarea",
      label: "CEO Description (German)",
    },
    {
      name: "ceo_image",
      type: "upload",
      relationTo: "media",
      label: "CEO Image",
    },
    {
      name: "mission_title_en",
      type: "text",
      label: "Mission Title (English)",
    },
    {
      name: "mission_title_de",
      type: "text",
      label: "Mission Title (German)",
    },
    {
      name: "mission_desc_en",
      type: "textarea",
      label: "Mission Description (English)",
    },
    {
      name: "mission_desc_de",
      type: "textarea",
      label: "Mission Description (German)",
    },
    {
      name: "vision_title_en",
      type: "text",
      label: "Vision Title (English)",
    },
    {
      name: "vision_title_de",
      type: "text",
      label: "Vision Title (German)",
    },
    {
      name: "vision_desc_en",
      type: "textarea",
      label: "Vision Description (English)",
    },
    {
      name: "vision_desc_de",
      type: "textarea",
      label: "Vision Description (German)",
    },
    {
      name: "values_title_en",
      type: "text",
      label: "Values Title (English)",
    },
    {
      name: "values_title_de",
      type: "text",
      label: "Values Title (German)",
    },
    {
      name: "values_desc_en",
      type: "textarea",
      label: "Values Description (English)",
    },
    {
      name: "values_desc_de",
      type: "textarea",
      label: "Values Description (German)",
    },
  ],
};
