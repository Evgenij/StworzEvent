// src/schemas/agenda-item.schema.ts
import { z } from "zod";

export const agendaItemSchema = (t: (key: string) => string) =>
	z.object({
		title: z.string().min(2, t("min2")),
		description: z.string().optional(),
		startsAt: z.string().min(1, t("required")),
		endsAt: z.string().optional(),
		location: z.string().optional(),
		speakerName: z.string().optional(),
	});

export type AgendaItemInput = z.infer<ReturnType<typeof agendaItemSchema>>;
