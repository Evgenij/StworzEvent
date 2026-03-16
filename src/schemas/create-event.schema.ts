// src/schemas/create-event.schema.ts
import { EventStatus } from "@prisma/client";
import { z } from "zod";

export const createEventSchema = z
	.object({
		title: z.string().min(3, "min3").max(100, "max100"),
		description: z.string().min(10, "min10"),
		coverImage: z.string().url("invalidUrl").optional().or(z.literal("")),
		startsAt: z.coerce.date(),
		endsAt: z.coerce.date(),
		location: z.string().min(2, "min2"), // город
		address: z.string().min(5, "min5"),
		categoryId: z.string().min(1, "required"),
		status: z.enum([EventStatus.DRAFT, EventStatus.PUBLISHED]),
	})
	.superRefine((data, ctx) => {
		if (data.endsAt <= data.startsAt) {
			ctx.addIssue({
				code: "custom",
				message: "endsAtAfterStartsAt",
				path: ["endsAt"],
			});
		}
	});

export type CreateEventInput = z.infer<typeof createEventSchema>;
