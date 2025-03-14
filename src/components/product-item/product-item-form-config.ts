import { CardConfig } from "../cards/shared/types";

export const productItemConfig: CardConfig = {
  title: "editProductItem",
  type: "productItem",
  sections: [
    {
      id: "scheduling",
      title: "scheduling",
      fields: [
        {
          name: "productDate",
          label: "date",
          type: "date",
          required: true,
          gridWidth: 6,
        },
        {
          name: "startTime",
          label: "startTime",
          type: "time",
          required: true,
          gridWidth: 6,
        },
        {
          name: "duration",
          label: "duration",
          type: "duration",
          required: true,
          gridWidth: 6,
          validation: {
            min: 1,
            max: 1440, // 24 hours in minutes
            message: "Please enter valid duration"
          }
        },
      ],
    },
    {
      id: "availability",
      title: "availability",
      fields: [
        {
          name: "price",
          label: "price",
          type: "price",
          required: true,
          gridWidth: 6,
          validation: {
            pattern: '^\\d+(\\.\\d{0,2})?$',
            message: "Please enter valid price",
            min: 0,
            max: 999999.99
          }
        },
        {
          name: "quantityAvailable",
          label: "quantity",
          type: "number",
          required: true,
          gridWidth: 6,
          validation: {
            min: 0,
            message: "Quantity cannot be negative"
          }
        },
      ],
    },
    {
      id: "details",
      title: "details",
      fields: [
        {
          name: "instructorName",
          label: "instructorName",
          type: "text",
          gridWidth: 12,
          condition: (formData) => formData.productType === 'lessons'
        },
        {
          name: "tourGuide",
          label: "tourGuide",
          type: "text",
          gridWidth: 12,
          condition: (formData) => formData.productType === 'tours'
        },
        {
          name: "equipmentSize",
          label: "equipmentSize",
          type: "text",
          gridWidth: 12,
          condition: (formData) => formData.productType === 'rentals'
        },
        {
          name: "notes",
          label: "notes",
          type: "textarea",
          rows: 3,
          gridWidth: 12,
        },
      ],
    },
  ],
};