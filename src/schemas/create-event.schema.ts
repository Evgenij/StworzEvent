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
			location: z.string().optional(),
			street: z.string().optional(),
			streetNumber: z.string().optional(),
			lat: z.number().optional().nullable(),
			lng: z.number().optional().nullable(),
			showMap: z.boolean(),
			eventIsOffline: z.boolean(),
			onlineUrl: z.url(t("invalidUrl")).optional().or(z.literal("")),
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

			if (!data.eventIsOffline) {
				if (!data.location || data.location.length < 2)
					ctx.addIssue({
						code: "custom",
						path: ["location"],
						message: t("min2"),
					});
				if (!data.street || data.street.length < 2)
					ctx.addIssue({
						code: "custom",
						path: ["street"],
						message: t("min2"),
					});
				if (!data.streetNumber || data.streetNumber.length < 1)
					ctx.addIssue({
						code: "custom",
						path: ["streetNumber"],
						message: t("required"),
					});
			} else {
				if (!data.onlineUrl)
					ctx.addIssue({
						code: "custom",
						path: ["onlineUrl"],
						message: t("required"),
					});
			}
		});

export type CreateEventInput = z.infer<ReturnType<typeof createEventSchema>>;
