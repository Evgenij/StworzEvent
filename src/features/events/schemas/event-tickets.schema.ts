// src/schemas/event-tickets.schema.ts
import { z } from "zod";

export const ticketSchema = (t: (key: string) => string) =>
	z.object({
		id: z.string().optional(),
		name: z.string().min(2, t("min2")),
		description: z.string().max(500, t("descriptionMax")).nullable().optional(),
		price: z.number().int().min(0, t("priceMin")),
		quantity: z.number().int().min(1, t("quantityMin")).nullable(),
	});

export const eventTicketsSchema = (t: (key: string) => string) =>
	z.object({
		tickets: z.array(ticketSchema(t)).min(1, t("ticketsMin")),
	});

export type TicketInput = z.infer<ReturnType<typeof ticketSchema>>;
export type EventTicketsInput = z.infer<ReturnType<typeof eventTicketsSchema>>;
