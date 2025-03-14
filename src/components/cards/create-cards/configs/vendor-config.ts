import { CardConfig } from "../../shared/types";

export const vendorConfig: CardConfig = {
  title: "createVendor",
  type: "vendor",
  sections: [
    {
      id: "header",
      title: "basicInfo",
      fields: [
        {
          name: "businessName",
          label: "businessName",
          type: "text",
          required: true,
          gridWidth: 12,
        },
        {
          name: "break",
          label: "break",
          type: "break",
          gridWidth: 12,
        },
        {
          name: "description",
          label: "description",
          type: "textarea",
          rows: 3,
          required: true,
          gridWidth: 12,
        },
        {
          name: "break",
          label: "break",
          type: "break",
          gridWidth: 12,
        },
      ],
    },
    {
      id: "contact",
      title: "contact",
      fields: [
        {
          name: "email",
          label: "email",
          type: "email",
          required: true,
          gridWidth: 6,
          validation: {
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            message: "Invalid email address",
          },
        },
        {
          name: "phone",
          label: "phone",
          type: "tel",
          required: true,
          gridWidth: 6,
          validation: {
            pattern: "^\\+?[1-9]\\d{1,14}$",
            message: "Invalid phone number",
          },
        },
        {
          name: "break",
          label: "break",
          type: "break",
          gridWidth: 12,
        },
        {
          name: "website",
          label: "website",
          type: "url",
          gridWidth: 12,
          validation: {
            pattern: "^(?:https?:\\/\\/)?(?:www\\.)?[\\w-]+(?:\\.[\\w-]+)*\\.[a-zA-Z]{2,4}(?:\\/[\\w-\\.~:/?#\\[\\]@!\\$&'\\(\\)\\*\\+,;=]*)?$",
            message: "Invalid URL"
          }
        },
        {
          name: "break",
          label: "break",
          type: "break",
          gridWidth: 12,
        },
        {
          name: "logoUrl",
          label: "logoUrl",
          type: "fileUpload",
          gridWidth: 12,
        },
      ],
    },
    {
      id: "location",
      title: "location",
      fields: [
        {
          name: "address",
          label: "address",
          type: "address",
          required: true,
          gridWidth: 12,
        },
      ],
    },
  ],
};
