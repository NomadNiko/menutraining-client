// src/types/support-ticket.ts
import { z } from "zod";

export enum TicketStatus {
  OPENED = "OPENED",
  ASSIGNED = "ASSIGNED",
  HOLD = "HOLD",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum TicketCategory {
  TICKETS = "TICKETS",
  PAYMENTS = "PAYMENTS",
  VENDORS = "VENDORS",
  TECHNICAL = "TECHNICAL",
  FEEDBACK = "FEEDBACK",
}

export interface TicketUpdate {
  timestamp: Date;
  userId: string;
  updateText: string;
}

export interface SupportTicket {
  _id: string;
  ticketId: string;
  status: TicketStatus;
  createdBy: string;
  createDate: Date;
  assignedTo?: string;
  ticketCategory: TicketCategory;
  ticketTitle: string;
  ticketDescription: string;
  updates: TicketUpdate[];
}

export const createTicketSchema = z.object({
  ticketCategory: z.nativeEnum(TicketCategory, {
    errorMap: () => ({ message: "Category is required" }),
  }),
  ticketTitle: z.string().min(1, "Title is required"),
  ticketDescription: z.string().min(1, "Description is required"),
});

export type CreateTicketDto = z.infer<typeof createTicketSchema>;

export const updateTicketSchema = createTicketSchema.partial();
export type UpdateTicketDto = z.infer<typeof updateTicketSchema>;

export const ticketUpdateSchema = z.object({
  updateText: z.string().min(1, "Update text is required"),
});
export type AddTicketUpdateDto = z.infer<typeof ticketUpdateSchema>;
