import { CardConfig } from "../cards/shared/types";

export const templateEditConfig: CardConfig = {
  title: "editTemplate",
  type: "template",
  sections: [
    {
      id: "basic",
      title: "basicInfo",
      fields: [
        {
          name: "templateName",
          label: "templateName",
          type: "text",
          required: true,
          fullWidth: true,
          gridWidth: 12,
        },
        {
          name: "description",
          label: "description",
          type: "textarea",
          rows: 3,
          gridWidth: 12,
        },
        {
          name: "additionalInfo",
          label: "additionalInfo",
          type: "textarea",
          rows: 3,
          gridWidth: 12,
        },
        {
          name: "productType",
          label: "productType",
          type: "select",
          options: [
            { value: "tours", label: "Tours" },
            { value: "lessons", label: "Lessons" },
            { value: "rentals", label: "Rentals" },
            { value: "tickets", label: "Tickets" },
          ],
          gridWidth: 6,
        },
        {
          name: "break",
          label: "break",
          type: "break",
          gridWidth: 12,
        },
        {
          name: "basePrice",
          label: "basePrice",
          type: "price",
          gridWidth: 6,
          validation: {
            pattern: "^\\d+(\\.\\d{0,2})?$",
            message: "Please enter valid price",
            min: 0,
            max: 999999.99,
          },
        },
        {
          name: "break",
          label: "break",
          type: "break",
          gridWidth: 12,
        },
        {
          name: "defaultDuration",
          label: "defaultDuration",
          type: "duration",
          gridWidth: 6,
        },
        {
          name: "imageURL",
          label: "imageUrl",
          type: "fileUpload",
          gridWidth: 12,
        },
      ],
    },
    {
      id: "requirements",
      title: "requirements",
      fields: [
        {
          name: "requirements",
          label: "requirements",
          type: "requirements",
          gridWidth: 12,
        },
        {
          name: "waiver",
          label: "waiver",
          type: "textarea",
          rows: 3,
          gridWidth: 12,
        },
      ],
    },
    {
      id: "location",
      title: "location",
      fields: [
        {
          name: "location",
          label: "location",
          type: "gpsLocation",
          gridWidth: 12,
        },
      ],
    },
  ],
};
