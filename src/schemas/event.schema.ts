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
			endsAt: z.string().min(1, t("required")),
			location: z.string().min(2, t("min2")),
			street: z.string().min(2, t("min2")),
			streetNumber: z.string().optional(),
			lat: z.number().optional().nullable(),
			lng: z.number().optional().nullable(),
			showMap: z.boolean(),
			eventIsOffline: z.boolean(),
			onlineUrl: z.url(t("invalidUrl")).optional().or(z.literal("")),
		})
		.superRefine((data, ctx) => {
			const normalizeDate = (s: string) => {
				if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) {
					return new Date(s + ":00.000Z");
				}
				return new Date(s);
			};

			const start = normalizeDate(data.startsAt);
			const end = normalizeDate(data.endsAt);

			console.log("start", end);
			console.log("end", end);

			if (
				!isNaN(start.getTime()) &&
				!isNaN(end.getTime()) &&
				end <= start
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
