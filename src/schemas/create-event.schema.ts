// src/schemas/create-event.schema.ts
import { EventStatus, Prisma } from "@prisma/client";
import { z } from "zod";

export const createEventSchema = (t: (key: string) => string) =>
	z.object({
		title: z.string().min(3, t("min3")).max(100, t("max100")),
		description: z.custom<Prisma.InputJsonValue>().optional(),
		coverImage: z.url(t("invalidUrl")).optional().or(z.literal("")),
		status: z.enum([EventStatus.DRAFT, EventStatus.PUBLISHED]),
		organizationId: z.string().min(1, t("required")),
	});

export type CreateEventInput = z.infer<ReturnType<typeof createEventSchema>>;
