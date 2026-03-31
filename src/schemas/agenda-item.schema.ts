// src/schemas/agenda-item.schema.ts
import { z } from "zod";

export const agendaItemSchema = (t: (key: string) => string) =>
	z.object({
		title: z.string().min(2, t("min2")),
		description: z.string().optional(),
		startsAt: z.string().nonempty(t("required")),
		endsAt: z.string().nonempty(t("required")),
		location: z.string().optional(),
		speakerName: z.string().optional(),
	});

export type AgendaItemInput = z.infer<ReturnType<typeof agendaItemSchema>>;
