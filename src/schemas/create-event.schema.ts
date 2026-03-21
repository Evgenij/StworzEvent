// src/schemas/create-event.schema.ts
import { EventStatus, Prisma } from "@prisma/client";
import { z } from "zod";

export const createEventSchema = (t: (key: string) => string) =>
	z
		.object({
			title: z.string().min(3, t("min3")).max(100, t("max100")),
			description: z.custom<Prisma.InputJsonValue>().optional(),
			coverImage: z.url(t("invalidUrl")).optional().or(z.literal("")),
			status: z.enum([EventStatus.DRAFT, EventStatus.PUBLISHED]),
			organizationId: z.string().min(1, t("required")),
			categoryId: z.string().min(1, t("required")),
			startsAt: z.string().min(1, t("required")),
			endsAt: z.string().optional(),
			location: z.string().min(2, t("min2")),
			address: z.string().min(5, t("min5")),
		})
		.superRefine((data, ctx) => {
			if (
				data.endsAt &&
				new Date(data.endsAt) <= new Date(data.startsAt)
			) {
				ctx.addIssue({
					code: "custom",
					message: t("endsAtAfterStartsAt"),
					path: ["endsAt"],
				});
			}
		});

export type CreateEventInput = z.infer<ReturnType<typeof createEventSchema>>;
